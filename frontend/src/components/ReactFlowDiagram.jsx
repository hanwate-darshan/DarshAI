import { useEffect, useMemo, useRef, useCallback, useState } from "react"
import { Handle, Position, ReactFlow, ReactFlowProvider, Controls, Background, MiniMap, useNodesState, useEdgesState, MarkerType } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import ELK from "elkjs/lib/elk.bundled.js"
import { toPng } from "html-to-image"
import { jsPDF } from "jspdf"
import { Image, FileText, Loader } from "lucide-react"

const elk = new ELK()

const elkOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.edgeNodeBetweenLayers": "50",
  "elk.spacing.nodeNode": "50",
  "elk.direction": "DOWN",
  "elk.layered.crossingMinimization.semiInteractive": "true",
  "elk.layered.considerModelOrder.strategy": "NODES_AND_EDGES"
}

const nodeSize = (label) => ({
  width: Math.max(140, Math.min(260, label.length * 10 + 60)),
  height: 50
})

const nodeStyles = {
  start: { bg: "#065f46", border: "#34d399", text: "#d1fae5", shape: "pill" },
  process: { bg: "#1e293b", border: "#6366f1", text: "#e2e8f0", shape: "rect" },
  decision: { bg: "#451a03", border: "#f59e0b", text: "#fef3c7", shape: "diamond" },
  end: { bg: "#4c0519", border: "#fb7185", text: "#ffe4e6", shape: "pill" }
}

function StartNode({ data }) {
  const s = nodeStyles.start
  return (
    <div className="px-4 py-2 rounded-full border-2 text-xs font-semibold tracking-wide uppercase" style={{ background: s.bg, borderColor: s.border, color: s.text }}>
      <Handle type="source" position={Position.Bottom} style={{ width: 8, height: 8, background: s.border, border: "none" }} />
      {data.label}
    </div>
  )
}

function ProcessNode({ data }) {
  const s = nodeStyles.process
  return (
    <div className="px-4 py-2 rounded-lg border-2 text-xs font-medium" style={{ background: s.bg, borderColor: s.border, color: s.text }}>
      <Handle type="target" position={Position.Top} style={{ width: 8, height: 8, background: s.border, border: "none" }} />
      {data.label}
      <Handle type="source" position={Position.Bottom} style={{ width: 8, height: 8, background: s.border, border: "none" }} />
    </div>
  )
}

function DecisionNode({ data }) {
  const s = nodeStyles.decision
  return (
    <div className="flex items-center justify-center text-xs font-semibold text-center px-6 py-4" style={{
      background: s.bg, color: s.text,
      border: `2px solid ${s.border}`,
      clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
      minWidth: 120, minHeight: 80
    }}>
      <Handle type="target" position={Position.Top} style={{ width: 8, height: 8, background: s.border, border: "none" }} />
      <span className="leading-tight">{data.label}</span>
      <Handle type="source" position={Position.Bottom} style={{ width: 8, height: 8, background: s.border, border: "none" }} />
      <Handle type="source" position={Position.Left} id="left" style={{ width: 8, height: 8, background: "#f59e0b", border: "none" }} />
      <Handle type="source" position={Position.Right} id="right" style={{ width: 8, height: 8, background: "#f59e0b", border: "none" }} />
    </div>
  )
}

function EndNode({ data }) {
  const s = nodeStyles.end
  return (
    <div className="px-4 py-2 rounded-full border-2 text-xs font-semibold tracking-wide" style={{ background: s.bg, borderColor: s.border, color: s.text }}>
      <Handle type="target" position={Position.Top} style={{ width: 8, height: 8, background: s.border, border: "none" }} />
      {data.label}
    </div>
  )
}

const nodeTypes = {
  start: StartNode,
  process: ProcessNode,
  decision: DecisionNode,
  end: EndNode
}

const layoutGraph = async (nodes, edges) => {
  const graph = {
    id: "root",
    layoutOptions: elkOptions,
    children: nodes.map((n) => {
      const { width, height } = nodeSize(n.label)
      return { id: n.id, width, height }
    }),
    edges: edges.map((e) => ({
      id: `e-${e.source}-${e.target}`,
      sources: [e.source],
      targets: [e.target]
    }))
  }
  const layout = await elk.layout(graph)
  const children = layout.children || []
  return {
    nodes: nodes.map((n) => {
      const ln = children.find((c) => c.id === n.id)
      return {
        id: n.id,
        type: n.type || "process",
        position: ln ? { x: ln.x, y: ln.y } : { x: 0, y: 0 },
        data: { label: n.label }
      }
    }),
    edges: edges.map((e) => {
      const isDecisionLabel = e.label && e.label.length > 0
      return {
        id: `e-${e.source}-${e.target}`,
        source: e.source,
        target: e.target,
        label: isDecisionLabel ? e.label : undefined,
        type: "smoothstep",
        animated: false,
        markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
        style: { stroke: isDecisionLabel ? "#f59e0b" : "#6366f1", strokeWidth: 2 },
        labelStyle: { fill: "#f59e0b", fontSize: 10, fontWeight: 600 },
        labelBgStyle: { fill: "#1e293b" },
        labelBgPadding: [4, 2],
        labelBgBorderRadius: 4
      }
    })
  }
}

function Flow({ data: raw }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const parsed = useMemo(() => {
    if (typeof raw === "string") {
      try { return JSON.parse(raw) } catch { return null }
    }
    return raw
  }, [raw])

  const isValid = parsed && Array.isArray(parsed.nodes)

  const init = useCallback(async () => {
    if (!isValid) return
    try {
      const result = await layoutGraph(parsed.nodes, parsed.edges || [])
      setNodes(result.nodes)
      setEdges(result.edges)
      setError(null)
    } catch (e) {
      setError(e.message || "Layout failed")
    }
    setLoading(false)
  }, [isValid, parsed, setNodes, setEdges])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { init() }, [init])

  const defaultEdgeOptions = useMemo(() => ({
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
    style: { stroke: "#6366f1", strokeWidth: 2 }
  }), [])

  if (loading && !isValid) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-300">
        Invalid diagram data
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 gap-2">
        <Loader size={18} className="animate-spin" />
        <span className="text-sm">Laying out diagram...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-300">
        {error}
      </div>
    )
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      fitView
      fitViewOptions={{ padding: 0.4 }}
      nodesDraggable
      nodesConnectable={false}
      elementsSelectable
      colorMode="dark"
      proOptions={{ hideAttribution: true }}
      nodeOrigin={[0.5, 0.5]}
      style={{ background: "#0d1117" }}
    >
      <Background color="#1e293b" gap={20} />
      <Controls showInteractive={false} className="!bg-[#1e293b] !border-white/10 !rounded-lg" />
      <MiniMap
        nodeStrokeColor="#6366f1"
        nodeColor="#1e293b"
        maskColor="rgba(0,0,0,0.6)"
        style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8 }}
      />
    </ReactFlow>
  )
}

function ReactFlowDiagram({ data }) {
  const containerRef = useRef(null)
  const [downloading, setDownloading] = useState(null)

  const handleDownloadPng = useCallback(async () => {
    const el = containerRef.current?.querySelector(".react-flow__renderer")
    if (!el) return
    setDownloading("png")
    try {
      const dataUrl = await toPng(el, { backgroundColor: "#0d1117" })
      const link = document.createElement("a")
      link.download = "diagram.png"
      link.href = dataUrl
      link.click()
    } catch (e) {
      console.error("PNG download failed", e)
    } finally {
      setDownloading(null)
    }
  }, [])

  const handleDownloadPdf = useCallback(async () => {
    const el = containerRef.current?.querySelector(".react-flow__renderer")
    if (!el) return
    setDownloading("pdf")
    try {
      const dataUrl = await toPng(el, { backgroundColor: "#0d1117" })
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: "a4" })
      const imgProps = pdf.getImageProperties(dataUrl)
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height)
      const w = imgProps.width * ratio * 0.9
      const h = imgProps.height * ratio * 0.9
      const x = (pageWidth - w) / 2
      const y = (pageHeight - h) / 2
      pdf.addImage(dataUrl, "PNG", x, y, w, h)
      pdf.save("diagram.pdf")
    } catch (e) {
      console.error("PDF download failed", e)
    } finally {
      setDownloading(null)
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.06] shrink-0">
        <span className="text-xs text-slate-400 mr-auto">Interactive Diagram — drag nodes to rearrange</span>
        <button
          onClick={handleDownloadPng}
          disabled={downloading}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] rounded-lg transition-colors duration-150 bg-transparent border-none cursor-pointer disabled:opacity-40"
        >
          {downloading === "png" ? <Loader size={13} className="animate-spin" /> : <Image size={13} />}
          PNG
        </button>
        <button
          onClick={handleDownloadPdf}
          disabled={downloading}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] rounded-lg transition-colors duration-150 bg-transparent border-none cursor-pointer disabled:opacity-40"
        >
          {downloading === "pdf" ? <Loader size={13} className="animate-spin" /> : <FileText size={13} />}
          PDF
        </button>
      </div>
      <div ref={containerRef} className="flex-1 min-h-0">
        <ReactFlowProvider>
          <Flow data={data} />
        </ReactFlowProvider>
      </div>
    </div>
  )
}

export default ReactFlowDiagram