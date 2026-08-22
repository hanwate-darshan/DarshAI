import axios from "axios"
import { checkAgentLimit } from "../config/agentLimit.js"
import { getModel } from "../config/llmModels.js"
import { deductCredits } from "../utils/deductCredits.js"
import { getFromS3 } from "../utils/getFromS3.js"
import { uploadToS3 } from "../utils/uploadToS3.js"

const safeJson = (value) => JSON.stringify(value).replace(/</g, "\\u003c")

const buildVideoHtml = ({ title, scenes }) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #000; color: #fff; font-family: -apple-system, Segoe UI, Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; }
  .player { position: relative; width: 100vw; height: 100vh; }
  .slide { position: absolute; inset: 0; opacity: 0; transition: opacity 1s ease; pointer-events: none; }
  .slide.active { opacity: 1; }
  .slide img { width: 100%; height: 100%; object-fit: cover; animation: kenburns 6s ease-in-out infinite alternate; }
  .caption { position: absolute; left: 0; right: 0; bottom: 12%; text-align: center; font-size: clamp(16px, 4vw, 34px); font-weight: 700; text-shadow: 0 2px 20px rgba(0,0,0,0.9); padding: 0 24px; letter-spacing: 0.5px; }
  .counter { position: absolute; top: 16px; right: 20px; font-size: 13px; color: rgba(255,255,255,0.7); background: rgba(0,0,0,0.5); padding: 4px 10px; border-radius: 999px; }
  .controls { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; }
  .controls button { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); color: #fff; border-radius: 8px; padding: 8px 16px; cursor: pointer; font-size: 13px; backdrop-filter: blur(6px); }
  .controls button:hover { background: rgba(255,255,255,0.3); }
  @keyframes kenburns { from { transform: scale(1) translate(0, 0); } to { transform: scale(1.12) translate(-1.5%, -1.5%); } }
</style>
</head>
<body>
<div class="player">
  <div class="counter" id="counter">1 / ${scenes.length}</div>
  ${scenes.map((scene, i) => `
  <div class="slide ${i === 0 ? "active" : ""}" id="slide${i}">
    <img src="${scene.imageUrl}" alt="">
    <div class="caption">${scene.caption}</div>
  </div>`).join("")}
  <div class="controls">
    <button onclick="prev()">&#9664; Prev</button>
    <button onclick="toggle()" id="playBtn">&#10074;&#10074; Pause</button>
    <button onclick="next()">Next &#9654;</button>
  </div>
</div>
<script>
const SCENES = ${safeJson(scenes)};
let current = 0;
let playing = true;
let timer = setInterval(next, 4000);

function show(i) {
  current = (i + SCENES.length) % SCENES.length;
  document.querySelectorAll(".slide").forEach(s => s.classList.remove("active"));
  document.getElementById("slide" + current).classList.add("active");
  document.getElementById("counter").textContent = (current + 1) + " / " + SCENES.length;
}
function next() { show(current + 1); }
function prev() { show(current - 1); }
function toggle() {
  playing = !playing;
  document.getElementById("playBtn").textContent = playing ? "\u23F8 Pause" : "\u25B6 Play";
  if (playing) timer = setInterval(next, 4000);
  else clearInterval(timer);
}
</script>
</body>
</html>`

export const videoAgent = async (state) => {
    try {
        await checkAgentLimit(state.userId, "video")

        const llm = await getModel("video")
        const storyRes = await llm.invoke(`
You are a video storyboard director.

Create a short cinematic slideshow video from the user request.

Return ONLY valid JSON:

{
  "title": "short title",
  "scenes": [
    {
      "caption": "one short line of narration/onscreen text",
      "imagePrompt": "detailed image generation prompt for the scene"
    }
  ]
}

Rules:
- Exactly 5 scenes.
- Each imagePrompt must be highly detailed (style, lighting, composition, subjects).
- Each caption must be 12 words or fewer.
- No markdown, no explanation, only JSON.

User Request:
${state.prompt}
`)

        let story = null
        try {
            story = JSON.parse(String(storyRes.content).trim())
        } catch (e) {
            return {
                ...state,
                aiResponse: "I couldn't create the storyboard. Please try again."
            }
        }

        if (!story?.scenes?.length) {
            return {
                ...state,
                aiResponse: "I couldn't create the video scenes. Please try again."
            }
        }

        const scenes = []
        for (let i = 0; i < story.scenes.length; i++) {
            const scene = story.scenes[i]
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(scene.imagePrompt)}`
            const imageRes = await axios.get(imageUrl, { responseType: "arraybuffer", timeout: 90000 })
            const filename = `video-${Date.now()}-${i}.png`
            await uploadToS3(filename, Buffer.from(imageRes.data), "image/png")
            const downloadUrl = await getFromS3(filename, 24 * 60 * 60)
            scenes.push({ caption: scene.caption, imageUrl: downloadUrl })
        }

        await deductCredits(state.userId, "video")

        const html = buildVideoHtml({ title: story.title, scenes })
        const imageMarkdown = scenes.map(s => `![frame](${s.imageUrl})`).join(" ")

        return {
            ...state,
            aiResponse: `# ${story.title}\n\nVideo generated with **${scenes.length} scenes** — play it in the artifact panel.\n\n${imageMarkdown}`,
            artifacts: [
                {
                    id: Date.now(),
                    type: "Video",
                    files: [{ name: "index.html", content: html }],
                    title: story.title
                }
            ]
        }
    } catch (error) {
        console.log(error)
        return {
            ...state,
            aiResponse: error?.data?.message || "failed to generate video"
        }
    }
}
