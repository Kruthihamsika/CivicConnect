import React, { useEffect, useState } from "react";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  Upload,
  LogOut,
  Phone,
  Shield,
  MapPin,
  PlayCircle,
} from "lucide-react";

import { supabase } from "./supabase";

export default function App() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [worker, setWorker] = useState<any>(null);

  const [complaints, setComplaints] =
    useState<any[]>([]);

  const [uploading, setUploading] =
    useState(false);

  useEffect(() => {
    const savedWorker =
      localStorage.getItem("worker");

    if (savedWorker) {
      const parsed =
        JSON.parse(savedWorker);

      setWorker(parsed);

      loadComplaints(parsed.id);
    }
  }, []);

  async function login() {
    if (!phone || !password) {
      alert("Enter phone and password");
      return;
    }

    const { data, error } =
      await supabase
        .from("workers")
        .select("*")
        .eq("phone", phone)
        .eq("password", password)
        .single();

    if (error || !data) {
      console.log(error);
      alert("Invalid login");
      return;
    }

    setWorker(data);

    localStorage.setItem(
      "worker",
      JSON.stringify(data)
    );

    loadComplaints(data.id);
  }

  async function loadComplaints(
    workerId: string
  ) {
    const { data, error } =
      await supabase
        .from("complaints")
        .select("*")
        .eq(
          "assigned_worker_id",
          workerId
        );

    if (error) {
      console.log(error);
      return;
    }

    setComplaints(data || []);
  }

  function logout() {
    localStorage.removeItem("worker");
    location.reload();
  }

  async function startWork(
    complaintId: string
  ) {
    await supabase
      .from("complaints")
      .update({
        status: "in_progress",
      })
      .eq("id", complaintId);

    loadComplaints(worker.id);
  }

  async function uploadCompletion(
    complaintId: string,
    file: any
  ) {
    if (!file) {
      alert("Select image");
      return;
    }

    try {
      setUploading(true);

      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } =
        await supabase.storage
          .from("completion-images")
          .upload(fileName, file);

      if (uploadError) {
        console.log(uploadError);
        alert(uploadError.message);
        return;
      }

      const { data: publicUrlData } =
        supabase.storage
          .from("completion-images")
          .getPublicUrl(fileName);

      const { error: updateError } =
        await supabase
          .from("complaints")
          .update({
            resolved_image_url:
              publicUrlData.publicUrl,
            status:
              "awaiting_verification",
          })
          .eq("id", complaintId);

      if (updateError) {
        console.log(updateError);
        alert(updateError.message);
        return;
      }

      alert(
        "Work uploaded successfully"
      );

      loadComplaints(worker.id);
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  // LOGIN PAGE

  if (!worker) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          background:
            "linear-gradient(135deg,#020617,#0f172a)",
          color: "white",
          fontFamily:
            "Inter, sans-serif",
        }}
      >
        {/* LEFT */}

        <div
          style={{
            flex: 1,
            padding: "80px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                width: "85px",
                height: "85px",
                borderRadius: "24px",
                background:
                  "linear-gradient(135deg,#8b5cf6,#6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
              }}
            >
              <Shield size={40} />
            </div>

            <div>
              <h1
                style={{
                  fontSize: "52px",
                  margin: 0,
                }}
              >
                CivicConnect
              </h1>

              <p
                style={{
                  color: "#94a3b8",
                  marginTop: "8px",
                  fontSize: "18px",
                }}
              >
                Smart Workforce Portal
              </p>
            </div>
          </div>

          <h1
            style={{
              fontSize: "78px",
              lineHeight: 1.1,
              marginBottom: "24px",
            }}
          >
            Worker Portal
          </h1>

          <p
            style={{
              fontSize: "24px",
              color: "#94a3b8",
              maxWidth: "600px",
              lineHeight: 1.6,
            }}
          >
            AI-powered civic workforce
            management platform for
            realtime smart city
            operations.
          </p>
        </div>

        {/* LOGIN */}

        <div
          style={{
            width: "520px",
            background: "#0f172a",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            padding: "50px",
          }}
        >
          <div
            style={{
              width: "100%",
              background:
                "rgba(255,255,255,0.03)",
              border:
                "1px solid rgba(255,255,255,0.08)",
              borderRadius: "32px",
              padding: "45px",
            }}
          >
            <h2
              style={{
                fontSize: "38px",
                marginBottom: "10px",
              }}
            >
              Worker Login
            </h2>

            <p
              style={{
                color: "#94a3b8",
                marginBottom: "35px",
                fontSize: "16px",
              }}
            >
              Login using your mobile
              number and password
            </p>

            {/* PHONE */}

            <div
              style={{
                marginBottom: "22px",
              }}
            >
              <label>Mobile Number</label>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: "#1e293b",
                  padding: "18px",
                  borderRadius: "18px",
                  marginTop: "10px",
                }}
              >
                <Phone
                  size={20}
                  color="#8b5cf6"
                />

                <input
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                  placeholder="Enter phone number"
                  style={{
                    background:
                      "transparent",
                    border: "none",
                    outline: "none",
                    color: "white",
                    width: "100%",
                    fontSize: "16px",
                  }}
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div
              style={{
                marginBottom: "32px",
              }}
            >
              <label>Password</label>

              <div
                style={{
                  background: "#1e293b",
                  padding: "18px",
                  borderRadius: "18px",
                  marginTop: "10px",
                }}
              >
                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter password"
                  style={{
                    background:
                      "transparent",
                    border: "none",
                    outline: "none",
                    color: "white",
                    width: "100%",
                    fontSize: "16px",
                  }}
                />
              </div>
            </div>

            <button
              onClick={login}
              style={{
                width: "100%",
                padding: "18px",
                borderRadius: "18px",
                border: "none",
                background:
                  "linear-gradient(135deg,#8b5cf6,#6366f1)",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Login
            </button>

            <div
              style={{
                marginTop: "24px",
                color: "#94a3b8",
                fontSize: "14px",
                lineHeight: 1.8,
              }}
            >
              Demo Login:
              <br />
              Phone: 8888888888
              <br />
              Password: 1234
            </div>
          </div>
        </div>
      </div>
    );
  }

  const assigned =
    complaints.filter(
      (c) =>
        c.status === "assigned" ||
        c.status === "in_progress"
    ).length;

  const completed =
    complaints.filter(
      (c) =>
        c.status ===
          "awaiting_verification" ||
        c.status === "closed"
    ).length;

  const pending =
    complaints.filter(
      (c) => c.status === "open"
    ).length;

  // DASHBOARD

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f1f5f9",
        fontFamily:
          "Inter, sans-serif",
      }}
    >
      {/* SIDEBAR */}

      <div
        style={{
          width: "300px",
          background:
            "linear-gradient(180deg,#1e1b4b,#172554)",
          color: "white",
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          justifyContent:
            "space-between",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "50px",
            }}
          >
            <div
              style={{
                width: "62px",
                height: "62px",
                borderRadius: "18px",
                background:
                  "linear-gradient(135deg,#8b5cf6,#6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
              }}
            >
              <Shield size={28} />
            </div>

            <div>
              <h2 style={{ margin: 0 }}>
                CivicConnect
              </h2>

              <p
                style={{
                  color: "#94a3b8",
                  marginTop: "4px",
                }}
              >
                Worker Portal
              </p>
            </div>
          </div>

          <div
            style={{
              background:
                "linear-gradient(135deg,#8b5cf6,#6366f1)",
              padding: "18px",
              borderRadius: "18px",
              marginBottom: "18px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <ClipboardList size={22} />

            <span
              style={{
                fontSize: "18px",
              }}
            >
              My Tasks
            </span>
          </div>

          <div
            style={{
              padding: "18px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              opacity: 0.7,
            }}
          >
            <MapPin size={22} />

            <span
              style={{
                fontSize: "18px",
              }}
            >
              Field Operations
            </span>
          </div>
        </div>

        {/* USER */}

        <div
          style={{
            background:
              "rgba(255,255,255,0.05)",
            borderRadius: "20px",
            padding: "20px",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3 style={{ margin: 0 }}>
              {worker.name}
            </h3>

            <p
              style={{
                color: "#94a3b8",
                marginTop: "4px",
              }}
            >
              Field Worker
            </p>
          </div>

          <button
            onClick={logout}
            style={{
              background:
                "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            <LogOut size={24} />
          </button>
        </div>
      </div>

      {/* MAIN */}

      <div
        style={{
          flex: 1,
          padding: "35px",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "46px",
                margin: 0,
                color: "#0f172a",
              }}
            >
              Worker Dashboard
            </h1>

            <p
              style={{
                color: "#64748b",
                fontSize: "18px",
              }}
            >
              Welcome back,{" "}
              {worker.name}
            </p>
          </div>

          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,#8b5cf6,#6366f1)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
              fontWeight: "bold",
              fontSize: "24px",
            }}
          >
            {worker.name[0]}
          </div>
        </div>

        {/* STATS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3,1fr)",
            gap: "22px",
            marginBottom: "35px",
          }}
        >
          {[
            [
              assigned,
              "Assigned",
              "#8b5cf6",
              ClipboardList,
            ],
            [
              pending,
              "Pending",
              "#22c55e",
              Clock,
            ],
            [
              completed,
              "Completed",
              "#ec4899",
              CheckCircle2,
            ],
          ].map(
            ([value, label, color, Icon]: any) => (
              <div
                key={label}
                style={{
                  background: color,
                  borderRadius: "28px",
                  padding: "35px",
                  color: "white",
                }}
              >
                <Icon size={34} />

                <h1
                  style={{
                    fontSize: "60px",
                    marginBottom: "10px",
                  }}
                >
                  {value}
                </h1>

                <p
                  style={{
                    fontSize: "22px",
                  }}
                >
                  {label}
                </p>
              </div>
            )
          )}
        </div>

        {/* COMPLAINTS */}

        <div>
          {complaints.map(
            (complaint: any) => (
              <div
                key={complaint.id}
                style={{
                  background: "white",
                  borderRadius: "28px",
                  padding: "28px",
                  marginBottom: "28px",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.06)",
                }}
              >
                <img
                  src={complaint.image_url}
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "20px",
                  }}
                />

                <h2
                  style={{
                    marginTop: "20px",
                    color: "#0f172a",
                  }}
                >
                  {complaint.title}
                </h2>

                <p
                  style={{
                    color: "#64748b",
                    fontSize: "18px",
                  }}
                >
                  {
                    complaint.description
                  }
                </p>

                <div
                  style={{
                    marginTop: "12px",
                    marginBottom:
                      "24px",
                  }}
                >
                  <span
                    style={{
                      background:
                        complaint.status ===
                          "awaiting_verification" ||
                        complaint.status ===
                          "closed"
                          ? "#22c55e"
                          : "#8b5cf6",
                      color: "white",
                      padding:
                        "10px 18px",
                      borderRadius:
                        "999px",
                      fontSize: "14px",
                    }}
                  >
                    {
                      complaint.status
                    }
                  </span>
                </div>

                {/* START WORK */}

                {complaint.status ===
                  "assigned" && (
                  <button
                    onClick={() =>
                      startWork(
                        complaint.id
                      )
                    }
                    style={{
                      background:
                        "linear-gradient(135deg,#3b82f6,#2563eb)",
                      color:
                        "white",
                      border: "none",
                      borderRadius:
                        "14px",
                      padding:
                        "14px 22px",
                      fontWeight:
                        "bold",
                      cursor:
                        "pointer",
                      marginBottom:
                        "20px",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "10px",
                    }}
                  >
                    <PlayCircle
                      size={18}
                    />
                    Start Work
                  </button>
                )}

                {/* UPLOAD */}

                {complaint.status !==
                  "closed" &&
                  complaint.status !==
                    "awaiting_verification" && (
                    <div
                      style={{
                        display: "flex",
                        gap: "16px",
                        marginTop:
                          "20px",
                        alignItems:
                          "center",
                      }}
                    >
                      <input
                        type="file"
                        id={`file-${complaint.id}`}
                        style={{
                          display:
                            "none",
                        }}
                        onChange={(
                          e
                        ) => {
                          const file =
                            e.target
                              .files?.[0];

                          if (
                            file
                          ) {
                            complaint.selectedFile =
                              file;

                            setComplaints(
                              [
                                ...complaints,
                              ]
                            );
                          }
                        }}
                      />

                      <label
                        htmlFor={`file-${complaint.id}`}
                        style={{
                          flex: 1,
                          background:
                            "#f1f5f9",
                          padding:
                            "16px",
                          borderRadius:
                            "16px",
                          cursor:
                            "pointer",
                          color:
                            "#0f172a",
                        }}
                      >
                        {complaint.selectedFile
                          ? complaint
                              .selectedFile
                              .name
                          : "Choose completion image"}
                      </label>

                      <button
                        disabled={
                          uploading
                        }
                        onClick={() =>
                          uploadCompletion(
                            complaint.id,
                            complaint.selectedFile
                          )
                        }
                        style={{
                          background:
                            "linear-gradient(135deg,#22c55e,#10b981)",
                          color:
                            "white",
                          border:
                            "none",
                          borderRadius:
                            "16px",
                          padding:
                            "16px 26px",
                          fontWeight:
                            "bold",
                          cursor:
                            "pointer",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "10px",
                        }}
                      >
                        <Upload
                          size={18}
                        />
                        Upload
                      </button>
                    </div>
                  )}

                {/* COMPLETION IMAGE */}

                {complaint.resolved_image_url && (
                  <div
                    style={{
                      marginTop: "25px",
                    }}
                  >
                    <h3>
                      Uploaded Completion
                      Image
                    </h3>

                    <img
                      src={
                        complaint.resolved_image_url
                      }
                      style={{
                        width: "100%",
                        borderRadius:
                          "20px",
                        marginTop:
                          "14px",
                      }}
                    />
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}