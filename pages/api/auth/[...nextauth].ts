import NextAuth from "next-auth";
import { authOptions } from "../../../src/utils/auth";

export default NextAuth(authOptions);
