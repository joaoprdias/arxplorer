import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom";
import { clusterArticles, fetchArxivArticles } from "../services/api";
import "./ClustersVisualization.css";

const ClustersVisualization = () => {
  const [query, setQuery] = useState("");
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(false);
  const svgRef = useRef(null);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const maxResults = 100;
      const sortBy = "relevance";
      const nClusters = 5;

      const articlesResponse = await fetchArxivArticles(query, maxResults, sortBy);
      const clusteringResponse = await clusterArticles(articlesResponse, nClusters);
      setClusters(clusteringResponse);
    } catch (err) {
      console.error("Error while trying to obtain clusters or articles", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clusters.length === 0) return;

    const width = 1200;
    const height = 700;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const container = svg.append("g");

    const nodes = clusters.map((article, index) => ({
      id: index,
      title: article.Title,
      cluster: article.Cluster,
      radius: 20 + Math.random() * 20,
      color: `hsl(${(article.Cluster * 360) / 5}, 70%, 50%)`,
    }));

    const truncateTitle = (title) => {
      const words = title.split(" ");
      let lines = [""];
      let lineIndex = 0;

      for (let word of words) {
        if ((lines[lineIndex] + word).length < 40) {
          lines[lineIndex] += (lines[lineIndex] ? " " : "") + word;
        } else {
          lineIndex++;
          if (lineIndex >= 2) {
            return lines.slice(0, 2).join("<br/>") + "...";
          }
          lines[lineIndex] = word;
        }
      }
      return lines.join("<br/>");
    };

    const simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(20))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d) => d.radius + 15))
      .force("x", d3.forceX((d) => (d.cluster * width) / 5).strength(0.4))
      .force("y", d3.forceY(height / 2).strength(0.3))
      .on("tick", () => {
        container
          .selectAll("circle")
          .data(nodes)
          .join("circle")
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y)
          .attr("r", (d) => d.radius)
          .attr("fill", (d) => d.color)
          .on("mouseover", function (event, d) {
            const tooltip = d3.select("#tooltip");
            tooltip
              .style("opacity", 1)
              .html(`<strong>${truncateTitle(d.title)}</strong><br/>Cluster: ${d.cluster}`);

            const svgRect = svgRef.current.getBoundingClientRect();
            const tooltipX = event.clientX - svgRect.left + 10;
            const tooltipY = event.clientY - svgRect.top + 15;

            tooltip
              .style("left", `${tooltipX}px`)
              .style("top", `${tooltipY}px`);
          })
          .on("mouseout", () => {
            d3.select("#tooltip").style("opacity", 0);
          });
      });

    const zoom = d3.zoom().scaleExtent([0.2, 6]).on("zoom", (event) => {
      container.attr("transform", event.transform);
    });

    svg.call(zoom);

    return () => simulation.stop();
  }, [clusters]);

  return (
    <div className="graph-container">
      <h2>Cluster Visualization</h2>

      <div className="controls">
        <input
          type="text"
          placeholder="Enter search query (e.g., Machine Learning)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Processing..." : "Visualize"}
        </button>
      </div>

      <div className="bubble-container">
        <svg ref={svgRef} width={1200} height={700}></svg>
        <div id="tooltip" className="tooltip"></div>
      </div>

      <div className="home-button-container">
        <button
          className="home-button"
          onClick={() => navigate("/")}
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default ClustersVisualization;