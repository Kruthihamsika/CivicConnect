import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  MapPin,
  Bell,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { supabase } from "./services/supabase";

export default function App() {
  const [activeTab, setActiveTab] =
    useState("dashboard");

  const [complaints, setComplaints] =
    useState<any[]>([]);

  const [workers, setWorkers] =
    useState<any[]>([]);

  const [clusters, setClusters] =
    useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: complaintsData } =
      await supabase
        .from("complaints")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    const { data: workersData } =
      await supabase
        .from("workers")
        .select("*");

    const { data: clustersData } =
      await supabase
        .from("clusters")
        .select("*");

    setComplaints(
      complaintsData || []
    );

    setWorkers(workersData || []);

    setClusters(clustersData || []);
  }

  async function approveWork(id: string) {
    await supabase
      .from("complaints")
      .update({
        status: "resolved",
      })
      .eq("id", id);

    loadData();
  }

  async function rejectWork(id: string) {
    await supabase
      .from("complaints")
      .update({
        status: "in_progress",
        resolved_image_url: null,
      })
      .eq("id", id);

    loadData();
  }

  const pendingCount =
    complaints.filter(
      (c) =>
        c.status === "assigned" ||
        c.status === "open"
    ).length;

  const progressCount =
    complaints.filter(
      (c) =>
        c.status === "in_progress"
    ).length;

  const completedCount =
    complaints.filter(
      (c) =>
        c.status === "resolved" ||
        c.status === "closed"
    ).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background:
          "linear-gradient(135deg,#020617,#020617)",
        color: "white",
        fontFamily:
          "Inter, sans-serif",
      }}
    >
      {/* SIDEBAR */}

      <div
        style={{
          width: "260px",
          background:
            "linear-gradient(180deg,#111827,#172554)",
          padding: "30px 22px",
          borderRight:
            "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <h1
          style={{
            fontSize: "38px",
            marginBottom: "60px",
            fontWeight: "bold",
          }}
        >
          CivicConnect
        </h1>

        {[
          {
            key: "dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
          },
          {
            key: "complaints",
            label: "Complaints",
            icon: ClipboardList,
          },
          {
            key: "workers",
            label: "Workers",
            icon: Users,
          },
          {
            key: "clusters",
            label: "Clusters",
            icon: MapPin,
          },
          {
            key: "notifications",
            label: "Notifications",
            icon: Bell,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              onClick={() =>
                setActiveTab(item.key)
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
                padding: "18px 22px",
                marginBottom: "18px",
                borderRadius: "22px",
                cursor: "pointer",
                background:
                  activeTab === item.key
                    ? "linear-gradient(135deg,#8b5cf6,#6366f1)"
                    : "transparent",
                transition: "0.2s",
              }}
            >
              <Icon size={26} />

              <span
                style={{
                  fontSize: "20px",
                }}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* MAIN */}

      <div
        style={{
          flex: 1,
          padding: "28px",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            marginBottom: "35px",
          }}
        >
          <h1
            style={{
              fontSize: "54px",
              margin: 0,
              fontWeight: "bold",
            }}
          >
            Admin Dashboard
          </h1>
        </div>

        {/* DASHBOARD */}

        {activeTab === "dashboard" && (
          <>
            {/* STATS */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3,1fr)",
                gap: "24px",
                marginBottom: "35px",
              }}
            >
              {[
                {
                  label: "Pending",
                  value: pendingCount,
                  color:
                    "linear-gradient(135deg,#8b5cf6,#6366f1)",
                },
                {
                  label: "In Progress",
                  value: progressCount,
                  color:
                    "linear-gradient(135deg,#22c55e,#16a34a)",
                },
                {
                  label: "Completed",
                  value: completedCount,
                  color:
                    "linear-gradient(135deg,#ec4899,#db2777)",
                },
              ].map((card) => (
                <div
                  key={card.label}
                  style={{
                    background:
                      card.color,
                    borderRadius:
                      "30px",
                    padding: "30px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "52px",
                      margin: 0,
                    }}
                  >
                    {card.value}
                  </h1>

                  <p
                    style={{
                      fontSize: "20px",
                      marginTop: "10px",
                    }}
                  >
                    {card.label}
                  </p>
                </div>
              ))}
            </div>

            {/* MAP */}

            <div
              style={{
                background:
                  "rgba(255,255,255,0.04)",
                borderRadius: "30px",
                padding: "28px",
              }}
            >
              <h2
                style={{
                  marginBottom: "18px",
                  fontSize: "28px",
                }}
              >
                Live Complaint Zones
              </h2>

              <iframe
                title="map"
                src="https://maps.google.com/maps?q=hyderabad&t=&z=10&ie=UTF8&iwloc=&output=embed"
                style={{
                  width: "100%",
                  height: "420px",
                  border: "none",
                  borderRadius: "24px",
                }}
              />
            </div>
          </>
        )}

        {/* COMPLAINTS */}

        {activeTab === "complaints" && (
          <div>
            {complaints.map(
              (complaint) => {
                const worker =
                  workers.find(
                    (w) =>
                      w.id ===
                      complaint.assigned_worker_id
                  );

                const cluster =
                  clusters.find(
                    (c) =>
                      c.id ===
                      complaint.cluster_id
                  );

                return (
                  <div
                    key={complaint.id}
                    style={{
                      background:
                        "rgba(255,255,255,0.04)",
                      borderRadius:
                        "34px",
                      padding: "26px",
                      marginBottom: "30px",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          complaint.resolved_image_url
                            ? "1.1fr 1fr"
                            : "1fr",
                        gap: "28px",
                      }}
                    >
                      {/* LEFT */}

                      <div>
                        <img
                          src={
                            complaint.image_url
                          }
                          style={{
                            width: "100%",
                            height: "260px",
                            objectFit:
                              "cover",
                            borderRadius:
                              "24px",
                            marginBottom:
                              "24px",
                          }}
                        />

                        <h2
                          style={{
                            fontSize: "34px",
                            marginBottom:
                              "10px",
                          }}
                        >
                          {
                            complaint.title
                          }
                        </h2>

                        <p
                          style={{
                            color:
                              "#94a3b8",
                            fontSize:
                              "18px",
                            lineHeight:
                              1.6,
                          }}
                        >
                          {
                            complaint.description
                          }
                        </p>

                        <div
                          style={{
                            display:
                              "flex",
                            gap: "14px",
                            flexWrap:
                              "wrap",
                            marginTop:
                              "24px",
                          }}
                        >
                          <div
                            style={{
                              background:
                                "#8b5cf6",
                              padding:
                                "10px 18px",
                              borderRadius:
                                "999px",
                              fontSize:
                                "15px",
                            }}
                          >
                            Status:{" "}
                            {
                              complaint.status
                            }
                          </div>

                          <div
                            style={{
                              background:
                                "#1e293b",
                              padding:
                                "10px 18px",
                              borderRadius:
                                "999px",
                              fontSize:
                                "15px",
                            }}
                          >
                            Worker:{" "}
                            {worker?.name ||
                              "Not Assigned"}
                          </div>

                          <div
                            style={{
                              background:
                                "#1e293b",
                              padding:
                                "10px 18px",
                              borderRadius:
                                "999px",
                              fontSize:
                                "15px",
                            }}
                          >
                            Cluster:{" "}
                            {cluster?.name ||
                              "N/A"}
                          </div>
                        </div>
                      </div>

                      {/* RIGHT */}

                      {complaint.resolved_image_url && (
                        <div>
                          <h2
                            style={{
                              marginBottom:
                                "18px",
                              fontSize:
                                "28px",
                            }}
                          >
                            Worker Completion
                            Proof
                          </h2>

                          <img
                            src={
                              complaint.resolved_image_url
                            }
                            style={{
                              width:
                                "100%",
                              height:
                                "240px",
                              objectFit:
                                "cover",
                              borderRadius:
                                "24px",
                            }}
                          />

                          {complaint.status ===
                            "awaiting_verification" && (
                            <div
                              style={{
                                display:
                                  "flex",
                                gap: "18px",
                                marginTop:
                                  "24px",
                              }}
                            >
                              <button
                                onClick={() =>
                                  approveWork(
                                    complaint.id
                                  )
                                }
                                style={{
                                  flex: 1,
                                  background:
                                    "linear-gradient(135deg,#22c55e,#16a34a)",
                                  border:
                                    "none",
                                  padding:
                                    "16px",
                                  borderRadius:
                                    "18px",
                                  color:
                                    "white",
                                  fontWeight:
                                    "bold",
                                  cursor:
                                    "pointer",
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  justifyContent:
                                    "center",
                                  gap: "10px",
                                  fontSize:
                                    "16px",
                                }}
                              >
                                <CheckCircle size={20} />
                                Accept Work
                              </button>

                              <button
                                onClick={() =>
                                  rejectWork(
                                    complaint.id
                                  )
                                }
                                style={{
                                  flex: 1,
                                  background:
                                    "linear-gradient(135deg,#ef4444,#dc2626)",
                                  border:
                                    "none",
                                  padding:
                                    "16px",
                                  borderRadius:
                                    "18px",
                                  color:
                                    "white",
                                  fontWeight:
                                    "bold",
                                  cursor:
                                    "pointer",
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  justifyContent:
                                    "center",
                                  gap: "10px",
                                  fontSize:
                                    "16px",
                                }}
                              >
                                <XCircle size={20} />
                                Reject Work
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}

        {/* WORKERS */}

        {activeTab === "workers" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(280px,1fr))",
              gap: "24px",
            }}
          >
            {workers.map((worker) => (
              <div
                key={worker.id}
                style={{
                  background:
                    "rgba(255,255,255,0.04)",
                  borderRadius:
                    "28px",
                  padding: "28px",
                }}
              >
                <h2>{worker.name}</h2>

                <p
                  style={{
                    color: "#94a3b8",
                  }}
                >
                  {worker.phone}
                </p>

                <div
                  style={{
                    marginTop: "18px",
                    background:
                      worker.status ===
                      "available"
                        ? "#22c55e"
                        : "#ef4444",
                    width: "fit-content",
                    padding:
                      "10px 18px",
                    borderRadius:
                      "999px",
                    fontSize: "14px",
                  }}
                >
                  {worker.status}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CLUSTERS */}

        {activeTab === "clusters" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(300px,1fr))",
              gap: "24px",
            }}
          >
            {clusters.map((cluster) => (
              <div
                key={cluster.id}
                style={{
                  background:
                    "rgba(255,255,255,0.04)",
                  borderRadius:
                    "28px",
                  padding: "28px",
                }}
              >
                <h2>{cluster.name}</h2>

                <p
                  style={{
                    color: "#94a3b8",
                  }}
                >
                  Active civic management
                  zone
                </p>
              </div>
            ))}
          </div>
        )}

        {/* NOTIFICATIONS */}

        {activeTab ===
          "notifications" && (
          <div
            style={{
              background:
                "rgba(255,255,255,0.04)",
              borderRadius: "28px",
              padding: "30px",
            }}
          >
            <h2>
              System Notifications
            </h2>

            <div
              style={{
                marginTop: "20px",
                color: "#94a3b8",
                lineHeight: 2,
                fontSize: "18px",
              }}
            >
              • Worker uploaded
              completion proof
              <br />
              • Complaint assigned
              successfully
              <br />
              • Cluster performance
              updated
            </div>
          </div>
        )}
      </div>
    </div>
  );
}