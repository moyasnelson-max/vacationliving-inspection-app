"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "../../lib/supabaseClient";
import CreateItemModal from "../../../components/CreateItemModal";

export default function ReportDetailsPage() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {
    setLoading(true);

    // Carga desde la vista que ya creamos
    const { data, error } = await supabase
      .from("report_full_view")
      .select("*")
      .eq("report_id", id);

    if (!error) {
      setItems(data);
      if (data.length > 0) {
        setMeta({
          created_at: data[0].report_created_at,
          property_id: data[0].property_id,
          inspector_id: data[0].inspector_id,
          status: data[0].report_status,
        });
      }
    }

    setLoading(false);
  }

  function statusColor(s) {
    if (s === "ok") return "#16a34a";
    if (s === "attention") return "#eab308";
    return "#dc2626";
  }

  // Agrupar por categoría
  const grouped = items.reduce((acc, item) => {
    const cat = item.category_name || "Sin categoría";
    acc[cat] = acc[cat] ? [...acc[cat], item] : [item];
    return acc;
  }, {});

  return (
    <div style={styles.container}>

      <h1 style={styles.title}>Inspection Report</h1>

      {loading && <p style={styles.loading}>Loading...</p>}

      {!loading && meta && (
        <div style={styles.metaBox}>
          <p><b>Report ID:</b> {id}</p>
          <p><b>Created at:</b> {new Date(meta.created_at).toLocaleString()}</p>
          <p><b>Inspector:</b> {meta.inspector_id}</p>
        </div>
      )}

      {/* Botón para items */}
      <button style={styles.addBtn} onClick={() => setOpenModal(true)}>
        + Add Item
      </button>

      {/* Render por categorías */}
      {Object.keys(grouped).map((cat) => (
        <div key={cat} style={styles.categorySection}>
          <h2 style={styles.categoryTitle}>{cat}</h2>

          {grouped[cat].map((item) => (
            <div key={item.item_id} style={styles.itemCard}>
              
              <div style={styles.itemHeader}>
                <span style={styles.subcat}>{item.subcategory_name}</span>

                <span
                  style={{
                    ...styles.statusBadge,
                    background: statusColor(item.item_status),
                  }}
                >
                  {item.item_status.toUpperCase()}
                </span>
              </div>

              {/* Notes */}
              {item.item_notes && (
                <p style={styles.notes}>{item.item_notes}</p>
              )}

              {/* Image */}
              {item.item_media && item.item_media.length > 0 && (
                <img
                  src={
                    process.env.NEXT_PUBLIC_SUPABASE_URL +
                    "/storage/v1/object/public/reports/" +
                    item.item_media[0]
                  }
                  style={styles.image}
                />
              )}

              <p style={styles.timestamp}>
                {new Date(item.item_created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ))}

      {/* Modal */}
      <CreateItemModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          loadReport(); // reload after add
        }}
        reportId={id}
      />
    </div>
  );
}

const styles = {
  container: {
    padding: "24px",
    color: "white",
    background: "#0d0d0d",
    minHeight: "100vh",
  },
  title: {
    fontSize: "28px",
    marginBottom: "12px",
  },
  loading: {
    opacity: 0.7,
  },
  metaBox: {
    marginBottom: "20px",
    padding: "16px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  addBtn: {
    padding: "10px 16px",
    background: "#C8A36D",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    color: "#000",
    marginBottom: "14px",
  },
  categorySection: {
    marginBottom: "30px",
  },
  categoryTitle: {
    fontSize: "22px",
    marginBottom: "10px",
    opacity: 0.8,
  },
  itemCard: {
    padding: "16px",
    marginBottom: "12px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
  },
  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    alignItems: "center",
  },
  subcat: {
    fontWeight: "600",
    fontSize: "16px",
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "13px",
    color: "white",
  },
  notes: {
    opacity: 0.9,
    margin: "8px 0",
  },
  image: {
    width: "100%",
    borderRadius: "10px",
    marginTop: "8px",
  },
  timestamp: {
    marginTop: "8px",
    fontSize: "12px",
    opacity: 0.6,
  },
};
