export default function randomId(): string {
    return "_" + Math.random().toString(36).substr(2, 5);
}
