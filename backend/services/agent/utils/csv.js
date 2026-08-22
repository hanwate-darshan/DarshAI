export const parseCsv = (text) => {
    const rows = []
    let row = []
    let cell = ""
    let inQuotes = false

    for (let i = 0; i < text.length; i++) {
        const char = text[i]

        if (inQuotes) {
            if (char === '"') {
                if (text[i + 1] === '"') {
                    cell += '"'
                    i++
                } else {
                    inQuotes = false
                }
            } else {
                cell += char
            }
        } else if (char === '"') {
            inQuotes = true
        } else if (char === ",") {
            row.push(cell)
            cell = ""
        } else if (char === "\n") {
            row.push(cell)
            rows.push(row)
            row = []
            cell = ""
        } else if (char !== "\r") {
            cell += char
        }
    }

    if (cell.length || row.length) {
        row.push(cell)
        rows.push(row)
    }

    if (rows.length < 2) {
        return { headers: [], rows: [], error: "CSV must contain a header row and at least one data row." }
    }

    const headers = rows[0].map(h => h.trim())
    const data = rows
        .slice(1)
        .filter(r => r.some(c => c.trim() !== ""))
        .map(r => {
            const obj = {}
            headers.forEach((h, idx) => {
                obj[h] = (r[idx] ?? "").trim()
            })
            return obj
        })

    return { headers, rows: data }
}

export const numericColumns = (headers, rows) => {
    const numeric = []
    headers.forEach(h => {
        let count = 0
        for (const r of rows) {
            const v = Number(r[h])
            if (!isNaN(v) && String(r[h]).trim() !== "") count++
        }
        if (count > 0 && count / rows.length > 0.5) numeric.push(h)
    })
    return numeric
}

export const columnStats = (values) => {
    const nums = values.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b)
    if (!nums.length) return null
    const sum = nums.reduce((a, b) => a + b, 0)
    const mid = Math.floor(nums.length / 2)
    return {
        count: nums.length,
        min: nums[0],
        max: nums[nums.length - 1],
        mean: +(sum / nums.length).toFixed(4),
        median: +(nums.length % 2 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2).toFixed(4)
    }
}

export const topValues = (values, limit = 10) => {
    const counts = {}
    values.forEach(v => {
        const key = v.trim() || "(empty)"
        counts[key] = (counts[key] || 0) + 1
    })
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
}
