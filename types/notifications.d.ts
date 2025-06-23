export type Notification = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    type: "transaction" | "budget" | "reminder";
    level: "info" | "warning" | "danger";
    message: string;
    isRead: boolean;
}