export default function randomId() {
    return "_" + Math.random().toString(36).substr(2, 5);
}
