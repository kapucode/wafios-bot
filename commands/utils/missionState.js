const missionState = new Map()

function setMissionState(userId, newState, renderFn) {
  const prev = missionState.get(userId) || {}
  const updated = { ...prev, ...newState }

  missionState.set(userId, updated)

  renderFn?.(userId)
}

module.exports = { missionState, setMissionState }