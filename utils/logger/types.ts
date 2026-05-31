export interface ConsoleEntry {
  id: string;
  type: "input" | "output" | "error";
  content: string;
  timestamp: number;
}
