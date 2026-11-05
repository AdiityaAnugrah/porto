export function createNetworkModel(count = 38) {
  const nodes = Array.from({ length: count }, (_, index) => {
    const angle = index * 2.3999632297;
    const y = 1 - 2 * (index + .5) / count;
    const radius = Math.sqrt(1 - y * y);
    return { x: Math.cos(angle) * radius * 1.6, y: y * 1.25, z: Math.sin(angle) * radius, accent: index % 13 === 0 };
  });
  const connections = new Set(), degree = Array(count).fill(0), edges = [];
  for (let a = 0; a < count; a++) {
    const nearest = nodes.map((node, b) => ({ b, distance: (node.x - nodes[a].x) ** 2 + (node.y - nodes[a].y) ** 2 + (node.z - nodes[a].z) ** 2 })).filter(item => item.b !== a).sort((x,y) => x.distance - y.distance);
    for (const { b } of nearest.slice(0,3)) {
      const key = `${Math.min(a,b)}:${Math.max(a,b)}`;
      if (connections.has(key) || degree[a] >= 4 || degree[b] >= 4) continue;
      connections.add(key); edges.push([a,b]); degree[a]++; degree[b]++;
    }
  }
  return { nodes, edges };
}

export function projectNode(node, yaw, pitch) {
  const x = node.x * Math.cos(yaw) + node.z * Math.sin(yaw);
  const z = -node.x * Math.sin(yaw) + node.z * Math.cos(yaw);
  const y = node.y * Math.cos(pitch) - z * Math.sin(pitch);
  const depth = node.y * Math.sin(pitch) + z * Math.cos(pitch);
  const scale = 4 / (4.6 - depth);
  return { x: x * scale, y: y * scale, depth, scale, accent: node.accent };
}
