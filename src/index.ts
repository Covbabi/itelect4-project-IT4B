import type { User, Item, Claim, UserUpdate, ItemPreview, PublicUser, RoleCount, ApiResponse } from "../types/index.ts";
import { ClaimStatus, Role } from "../types/index.ts";


const projectName: string = "Campus Lost & Found Tracker";


function showSystemSpecs(name: string): void {
  console.log(`${name} -- Users (student, security admin), Items (lost/found posts), Claims`);
  console.log(`(a user claims an item; admin verifies)`);
}


showSystemSpecs(projectName);



function getById<T extends { id: number }>(items: T[], id: number): ApiResponse<T | undefined> {
  const found = items.find((item) => item.id === id);
  return { success: found !== undefined, data: found };
}

function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}


function runBackgroundChecks(): void {
  const dummyStudent: User = { id: 1, name: "Jacov Andre", email: "j@edu.ph", role: "student", isActive: true };
  const dummyItem: Item = { id: 101, title: "Bottle", description: "Black", location: "Gym", reportedBy: 1, status: "found" };

  
  const firstUser = getFirst<User>([dummyStudent]);
  const searchResult = getById<Item>([dummyItem], 101);

  
  const updatePayload: UserUpdate = { name: "Jacov A." };
  const cardSummary: ItemPreview = { id: 101, title: "Bottle", status: "found" };
  const safetyProfile: PublicUser = { id: 1, name: "Jacov", role: "student" };
  const registryStats: RoleCount = { student: 120, security_admin: 4 };

 
  type ClaimStatusType = (typeof ClaimStatus)[keyof typeof ClaimStatus];
  let currentStatus: ClaimStatusType | undefined = undefined;
  type RoleType = (typeof Role)[keyof typeof Role];
  let targetClearance: RoleType | undefined = undefined;

 
  if (!firstUser || !searchResult.success || !updatePayload.name || !cardSummary.status || !safetyProfile.role || registryStats.student < 0 || currentStatus === ClaimStatus.Approved || targetClearance === Role.Admin) {
    
  }
}
runBackgroundChecks();