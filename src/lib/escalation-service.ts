import type { Escalation, EscalationComment } from "./types";

const ESCALATIONS_STORAGE_KEY = "traveller_connect_escalations";

// Get all escalations for a user from localStorage
export function getEscalations(userId: string): Escalation[] {
  if (typeof window === "undefined") return [];

  const storedEscalations = localStorage.getItem(ESCALATIONS_STORAGE_KEY);
  if (!storedEscalations) return [];

  try {
    const allEscalations = JSON.parse(storedEscalations) as Escalation[];
    return allEscalations.filter((escalation) => escalation.userId === userId);
  } catch (error) {
    console.error("Failed to parse stored escalations:", error);
    return [];
  }
}

// Get all escalations from localStorage
function getAllEscalations(): Escalation[] {
  if (typeof window === "undefined") return [];

  const storedEscalations = localStorage.getItem(ESCALATIONS_STORAGE_KEY);
  if (!storedEscalations) return [];

  try {
    return JSON.parse(storedEscalations) as Escalation[];
  } catch (error) {
    console.error("Failed to parse stored escalations:", error);
    return [];
  }
}

// Save escalations to localStorage
function saveEscalations(escalations: Escalation[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ESCALATIONS_STORAGE_KEY, JSON.stringify(escalations));
}

// Create a new escalation
export function createEscalation(data: {
  userId: string;
  userName: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
}): Escalation {
  const escalations = getAllEscalations();

  const newEscalation: Escalation = {
    id: `esc-${Date.now()}`,
    userId: data.userId,
    userName: data.userName,
    title: data.title,
    category: data.category,
    description: data.description,
    imageUrl: data.imageUrl,
    status: "pending",
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add a welcome comment from the agency
  const welcomeComment: EscalationComment = {
    text: "Thank you for your query. Our team will review your case and get back to you shortly.",
    isFromAgency: true,
    createdAt: new Date().toISOString(),
  };

  newEscalation.comments.push(welcomeComment);

  const updatedEscalations = [newEscalation, ...escalations];
  saveEscalations(updatedEscalations);

  return newEscalation;
}

// Add a comment to an escalation
export function addEscalationComment(
  escalationId: string,
  comment: Omit<EscalationComment, "id">
): Escalation {
  const escalations = getAllEscalations();

  const updatedEscalations = escalations.map((escalation) => {
    if (escalation.id === escalationId) {
      return {
        ...escalation,
        comments: [...escalation.comments, comment],
        updatedAt: new Date().toISOString(),
      };
    }
    return escalation;
  });

  saveEscalations(updatedEscalations);

  return updatedEscalations.find((e) => e.id === escalationId)!;
}

// Update escalation status
export function updateEscalationStatus(
  escalationId: string,
  status: "pending" | "in_progress" | "resolved"
): Escalation {
  const escalations = getAllEscalations();

  const updatedEscalations = escalations.map((escalation) => {
    if (escalation.id === escalationId) {
      // Add a system comment about the status change
      const statusComment: EscalationComment = {
        text: `Status updated to ${status.replace("_", " ")}.`,
        isFromAgency: true,
        createdAt: new Date().toISOString(),
      };

      return {
        ...escalation,
        status,
        comments: [...escalation.comments, statusComment],
        updatedAt: new Date().toISOString(),
      };
    }
    return escalation;
  });

  saveEscalations(updatedEscalations);

  return updatedEscalations.find((e) => e.id === escalationId)!;
}
