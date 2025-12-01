import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20 },
  title: { fontSize: 18, marginBottom: 10 },
  item: { fontSize: 12, marginBottom: 4 },
});

export default function PdfDocument({ title = "Inspection Report", items = [] }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{title}</Text>

        <View>
          {items.map((i, idx) => (
            <Text key={idx} style={styles.item}>• {i}</Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
