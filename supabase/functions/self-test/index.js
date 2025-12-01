export default async (_, res) => {
  return res.json({
    ok: true,
    message: "Vacation Living · Self-test OK",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
};
