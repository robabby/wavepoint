/**
 * SynthesisGraph - The knowledge graph connecting all systems.
 *
 * This class manages nodes and edges, providing traversal and query capabilities.
 */

import type {
  SynthesisGraph,
  SynthesisNode,
  SynthesisEdge,
  NodeType,
  SynthesisQuery,
  SynthesisResult,
} from "./types";
import { DEFAULT_MAX_DEPTH, DEFAULT_MIN_WEIGHT } from "./constants";

/**
 * Create a composite key for a node
 */
export function nodeKey(type: NodeType, id: string): string {
  return `${type}:${id}`;
}

/**
 * Parse a composite key back to type and id
 */
export function parseNodeKey(key: string): { type: NodeType; id: string } {
  const [type, ...idParts] = key.split(":");
  return { type: type as NodeType, id: idParts.join(":") };
}

/**
 * Create a new empty synthesis graph
 */
export function createGraph(): SynthesisGraph {
  return {
    nodes: new Map(),
    edges: new Map(),
    adjacency: new Map(),
    reverseAdjacency: new Map(),
  };
}

/**
 * Add a node to the graph
 */
export function addNode(graph: SynthesisGraph, node: SynthesisNode): void {
  const key = nodeKey(node.type, node.id);
  graph.nodes.set(key, node);

  // Initialize adjacency lists
  if (!graph.adjacency.has(key)) {
    graph.adjacency.set(key, []);
  }
  if (!graph.reverseAdjacency.has(key)) {
    graph.reverseAdjacency.set(key, []);
  }
}

/**
 * Add an edge to the graph
 */
export function addEdge(graph: SynthesisGraph, edge: SynthesisEdge): void {
  graph.edges.set(edge.id, edge);

  const sourceKey = nodeKey(edge.sourceType, edge.sourceId);
  const targetKey = nodeKey(edge.targetType, edge.targetId);

  // Add to adjacency lists
  const sourceAdj = graph.adjacency.get(sourceKey) ?? [];
  sourceAdj.push(edge.id);
  graph.adjacency.set(sourceKey, sourceAdj);

  const targetRevAdj = graph.reverseAdjacency.get(targetKey) ?? [];
  targetRevAdj.push(edge.id);
  graph.reverseAdjacency.set(targetKey, targetRevAdj);

  // For bidirectional edges, add reverse direction
  if (edge.bidirectional) {
    const targetAdj = graph.adjacency.get(targetKey) ?? [];
    targetAdj.push(edge.id);
    graph.adjacency.set(targetKey, targetAdj);

    const sourceRevAdj = graph.reverseAdjacency.get(sourceKey) ?? [];
    sourceRevAdj.push(edge.id);
    graph.reverseAdjacency.set(sourceKey, sourceRevAdj);
  }
}

/**
 * Get a node by type and ID
 */
export function getNode(
  graph: SynthesisGraph,
  type: NodeType,
  id: string
): SynthesisNode | undefined {
  return graph.nodes.get(nodeKey(type, id));
}

/**
 * Get all edges from a node
 */
export function getEdgesFrom(
  graph: SynthesisGraph,
  type: NodeType,
  id: string
): SynthesisEdge[] {
  const key = nodeKey(type, id);
  const edgeIds = graph.adjacency.get(key) ?? [];
  return edgeIds
    .map((edgeId) => graph.edges.get(edgeId))
    .filter((e): e is SynthesisEdge => e !== undefined);
}

/**
 * Get connected nodes from a starting node
 */
export function getConnectedNodes(
  graph: SynthesisGraph,
  type: NodeType,
  id: string
): SynthesisNode[] {
  const edges = getEdgesFrom(graph, type, id);
  const connected: SynthesisNode[] = [];

  for (const edge of edges) {
    // Get the "other" end of the edge
    const isSource =
      edge.sourceType === type && edge.sourceId === id;
    const targetType = isSource ? edge.targetType : edge.sourceType;
    const targetId = isSource ? edge.targetId : edge.sourceId;

    const node = getNode(graph, targetType, targetId);
    if (node) {
      connected.push(node);
    }
  }

  return connected;
}

/**
 * Query the graph using BFS traversal
 */
export function query(
  graph: SynthesisGraph,
  params: SynthesisQuery
): SynthesisResult {
  const maxDepth = params.maxDepth ?? DEFAULT_MAX_DEPTH;
  const minWeight = params.minWeight ?? DEFAULT_MIN_WEIGHT;

  const visited = new Set<string>();
  const resultNodes: SynthesisNode[] = [];
  const resultEdges: SynthesisEdge[] = [];
  const paths: SynthesisResult["paths"] = [];

  // BFS queue: [nodeKey, depth, path]
  const queue: Array<[string, number, SynthesisEdge[]]> = [];

  // Initialize with seed nodes
  for (const seed of params.seeds) {
    const key = nodeKey(seed.type, seed.id);
    const node = graph.nodes.get(key);
    if (node) {
      queue.push([key, 0, []]);
      visited.add(key);
      resultNodes.push(node);
      paths.push({ node, path: [], totalWeight: 10 });
    }
  }

  // BFS traversal
  while (queue.length > 0) {
    const [currentKey, depth, currentPath] = queue.shift()!;

    if (depth >= maxDepth) continue;

    const edgeIds = graph.adjacency.get(currentKey) ?? [];

    for (const edgeId of edgeIds) {
      const edge = graph.edges.get(edgeId);
      if (!edge) continue;

      // Filter by edge type if specified
      if (params.edgeTypes && !params.edgeTypes.includes(edge.type)) {
        continue;
      }

      // Filter by minimum weight
      if (edge.weight < minWeight) continue;

      // Determine the target node
      const { type: currentType, id: currentId } = parseNodeKey(currentKey);
      const isSource =
        edge.sourceType === currentType && edge.sourceId === currentId;

      // For non-bidirectional edges, only traverse in forward direction
      if (!isSource && !edge.bidirectional) continue;

      const targetType = isSource ? edge.targetType : edge.sourceType;
      const targetId = isSource ? edge.targetId : edge.sourceId;
      const targetKey = nodeKey(targetType, targetId);

      // Filter by target type if specified
      if (params.targetTypes && !params.targetTypes.includes(targetType)) {
        continue;
      }

      if (visited.has(targetKey)) continue;
      visited.add(targetKey);

      const targetNode = graph.nodes.get(targetKey);
      if (!targetNode) continue;

      const newPath = [...currentPath, edge];
      const totalWeight = newPath.reduce((sum, e) => sum + e.weight, 0);

      resultNodes.push(targetNode);
      resultEdges.push(edge);
      paths.push({ node: targetNode, path: newPath, totalWeight });

      queue.push([targetKey, depth + 1, newPath]);
    }
  }

  return { nodes: resultNodes, edges: resultEdges, paths };
}

/**
 * Get all nodes of a specific type
 */
export function getNodesByType(
  graph: SynthesisGraph,
  type: NodeType
): SynthesisNode[] {
  const nodes: SynthesisNode[] = [];
  for (const [key, node] of graph.nodes) {
    if (key.startsWith(`${type}:`)) {
      nodes.push(node);
    }
  }
  return nodes;
}

/**
 * Get the number of nodes in the graph
 */
export function nodeCount(graph: SynthesisGraph): number {
  return graph.nodes.size;
}

/**
 * Get the number of edges in the graph
 */
export function edgeCount(graph: SynthesisGraph): number {
  return graph.edges.size;
}
