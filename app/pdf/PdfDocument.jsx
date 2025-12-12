"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

/* ---------------------------------------------------------
   REGISTRO DE FUENTES — Nivel Marriott
--------------------------------------------------------- */
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTai9P38.ttf" }, // Regular
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTai9P38.ttf",
      fontWeight: 600,
    }, // SemiBold
  ],
});

/* ---------------------------------------------------------
   PALETA DE COLORES VACATION LIVING
--------------------------------------------------------- */
const COLORS = {
  gold: "#C8A36D",
  beige: "#F6F1EB",
  dark: "#222",
  mid: "#666",
  light: "#999",
  border: "#DDDDDD",
  white: "#FFFFFF",
};

/* ---------------------------------------------------------
   ESTILOS MARRIOTT
--------------------------------------------------------- */
const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    padding: 32,
    backgroundColor: COLORS.white,
  },

  /* HEADER */
  header: {
    borderBottom: `1px solid ${COLORS.border}`,
    paddingBottom: 12,
    marginBottom: 22,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 600,
    color: COLORS.dark,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.mid,
    marginTop: 2,
  },

  /* SECTIONS */
  sectionWrapper: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    border: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.beige,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 600,
    color: COLORS.gold,
  },
  sectionText: {
    fontSize: 12,
    lineHeight: 1.5,
    color: COLORS.dark,
  },

  /* FOOTER */
  footer: {
    position: "absolute",
    bottom: 16,
    left: 32,
    right: 32,
    fontSize: 10,
    color: COLORS.light,
    borderTop: `1px solid ${COLORS.border}`,
    paddingTop: 6,
    textAlign: "center",
  },
});

/* ---------------------------------------------------------
   DOCUMENTO PDF — NIVEL MARRIOTT COMPLETO
--------------------------------------------------------- */
export default function PdfDocument({
  propertyName,
  inspectorName,
  timestamp,
  sections,
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Inspection Report — {propertyName}
          </Text>
          <Text style={styles.headerSubtitle}>Generated on: {timestamp}</Text>
          <Text style={styles.headerSubtitle}>Inspector: {inspectorName}</Text>
        </View>

        {/* SECTIONS */}
        {sections?.map((sec, i) => (
          <View key={i} style={styles.sectionWrapper}>
            <Text style={styles.sectionTitle}>{sec.heading}</Text>
            <Text style={styles.sectionText}>{sec.body}</Text>
          </View>
        ))}

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text>Vacation Living — Inspection System</Text>
          <Text>www.vacationlivingvirtualtour.com</Text>
        </View>
      </Page>
    </Document>
  );
}
