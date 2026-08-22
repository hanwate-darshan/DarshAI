import fs from "fs/promises"
import { checkAgentLimit } from "../config/agentLimit.js"
import { getModel } from "../config/llmModels.js"
import { deductCredits } from "../utils/deductCredits.js"
import { columnStats, numericColumns, parseCsv, topValues } from "../utils/csv.js"

const safeJson = (value) => JSON.stringify(value).replace(/</g, "\\u003c")

const buildChartHtml = ({ title, headers, rows, numeric }) => {
    const previewRows = rows.slice(0, 10)
    const numericSeries = numeric.map(h => ({
        label: h,
        values: rows.slice(0, 200).map(r => {
            const v = Number(r[h])
            return isNaN(v) ? null : v
        })
    }))
    const categorical = headers.filter(h => !numeric.includes(h))[0]
    const catTop = categorical ? topValues(rows.map(r => r[categorical]), 10) : []

    const chartHtml = numericSeries.map((s, i) => `
<div class="card">
  <h3>${s.label} (trend)</h3>
  <canvas id="line${i}"></canvas>
</div>`).join("")

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Data Analysis</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<style>
  * { box-sizing: border-box; margin: 0; }
  body { font-family: -apple-system, Segoe UI, Roboto, sans-serif; background: #0d1117; color: #e6edf3; padding: 24px; }
  h1 { font-size: 20px; margin-bottom: 4px; }
  h3 { font-size: 14px; margin-bottom: 12px; color: #7d8590; }
  .sub { color: #7d8590; font-size: 12px; margin-bottom: 20px; }
  .card { background: #161b22; border: 1px solid #21262d; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { text-align: left; color: #7d8590; border-bottom: 1px solid #21262d; padding: 6px 8px; position: sticky; top: 0; background: #161b22; }
  td { border-bottom: 1px solid #161b22; padding: 6px 8px; }
  .table-wrap { max-height: 320px; overflow: auto; }
  canvas { max-height: 260px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
</style>
</head>
<body>
<h1>${title}</h1>
<p class="sub">${rows.length} rows &middot; ${headers.length} columns</p>
<div class="card table-wrap">
  <h3>Data Preview (first 10 rows)</h3>
  <table>
    <thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${previewRows.map(r => `<tr>${headers.map(h => `<td>${r[h]}</td>`).join("")}</tr>`).join("")}</tbody>
  </table>
</div>
<div class="grid">
  ${chartHtml}
  ${catTop.length ? `
  <div class="card">
    <h3>${categorical} (top values)</h3>
    <canvas id="bar0"></canvas>
  </div>` : ""}
</div>
<script>
const CATEGORICAL = ${safeJson(catTop)};
const SERIES = ${safeJson(numericSeries)};
${numericSeries.map((_, i) => `
new Chart(document.getElementById("line${i}"), {
  type: "line",
  data: {
    labels: SERIES[${i}].values.map((_, idx) => idx + 1),
    datasets: [{ label: SERIES[${i}].label, data: SERIES[${i}].values, borderColor: "#6366f1", backgroundColor: "rgba(99,102,241,0.15)", fill: true, tension: 0.3, pointRadius: 0 }]
  },
  options: { plugins: { legend: { display: false } }, scales: { x: { ticks: { color: "#7d8590" } }, y: { ticks: { color: "#7d8590" } } } }
});`).join("")}
${catTop.length ? `
new Chart(document.getElementById("bar0"), {
  type: "bar",
  data: {
    labels: CATEGORICAL.map(c => c[0]),
    datasets: [{ label: "count", data: CATEGORICAL.map(c => c[1]), backgroundColor: "#8b5cf6", borderRadius: 6 }]
  },
  options: { indexAxis: "y", plugins: { legend: { display: false } }, scales: { x: { ticks: { color: "#7d8590" } }, y: { ticks: { color: "#7d8590" } } } }
});` : ""}
</script>
</body>
</html>`
}

export const dataAnalyzer = async (state) => {
    try {
        await checkAgentLimit(state.userId, "data")

        const buffer = await fs.readFile(state.file.path)
        const text = buffer.toString("utf-8")

        const { headers, rows, error } = parseCsv(text)
        if (error) {
            return { ...state, aiResponse: `## Data Analysis\n\n${error}` }
        }
        if (!rows.length) {
            return { ...state, aiResponse: "## Data Analysis\n\nThe CSV has a header row but no data rows." }
        }

        const numeric = numericColumns(headers, rows)

        let statsMarkdown = `## Data Analysis\n\n`
        statsMarkdown += `- **Rows:** ${rows.length}\n`
        statsMarkdown += `- **Columns:** ${headers.length}\n\n`

        if (numeric.length) {
            statsMarkdown += `### Numeric Summary\n\n`
            statsMarkdown += `| Column | Count | Min | Max | Mean | Median |\n`
            statsMarkdown += `|---|---|---|---|---|---|\n`
            numeric.forEach(h => {
                const s = columnStats(rows.map(r => r[h]))
                if (s) {
                    statsMarkdown += `| ${h} | ${s.count} | ${s.min} | ${s.max} | ${s.mean} | ${s.median} |\n`
                }
            })
            statsMarkdown += `\n`
        }

        const llm = await getModel("data")
        const sample = rows.slice(0, 25)
        const insightRes = await llm.invoke(`
You are a data analyst. Analyze the following dataset and provide concise insights.

Headers: ${JSON.stringify(headers)}
Numeric columns: ${JSON.stringify(numeric)}
Rows (first 25): ${JSON.stringify(sample)}

Return markdown with:
# Key Insights
- bullet point observations (trends, outliers, patterns)

# Suggested Actions
- 3 bullet points
Keep it brief and data-driven.`)

        statsMarkdown += `### AI Insights\n\n${insightRes.content}\n`
        await deductCredits(state.userId, "data")

        const html = buildChartHtml({
            title: state.file.originalname,
            headers,
            rows,
            numeric
        })

        return {
            ...state,
            aiResponse: statsMarkdown,
            artifacts: [
                {
                    id: Date.now(),
                    type: "DataAnalysis",
                    files: [{ name: "index.html", content: html }],
                    title: state.file.originalname
                }
            ]
        }
    } catch (error) {
        console.log(error)
        return {
            ...state,
            aiResponse: error?.data?.message || "failed to analyze data"
        }
    } finally {
        try { await fs.unlink(state.file.path) } catch (e) { }
    }
}
