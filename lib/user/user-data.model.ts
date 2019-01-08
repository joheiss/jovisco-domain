export interface UserData {
    email: string | null;
    roles?: string[];
    organization?: string;
    displayName?: string;
    phoneNumber?: string;
    imageUrl?: string;
    isLocked?: boolean;
    uid?: string;
}
