import { authTypeDef } from "./auth";
import {commentTypeDefs} from "./comment";
import {enumTypeDefs} from "./enum";
import {projectTypeDefs} from "./project";
import {projectMemberTypeDefs} from "./projectMember";
import {taskTypeDefs} from "./task";
import {userTypeDefs} from "./user";


export const typeDefs = [
  authTypeDef,
  commentTypeDefs,
  enumTypeDefs,
  projectTypeDefs,
  projectMemberTypeDefs,
  taskTypeDefs,
  userTypeDefs
];
