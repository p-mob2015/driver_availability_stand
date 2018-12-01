module.exports = {
  reverseProportionalPercentage (total, selection) {
    const gap = total - selection
    return (gap < 0) ? 0 : (gap / total) * 100
  },
}
