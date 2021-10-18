export default function uuidv4() {
  return (crypto as any).randomUUID();
}