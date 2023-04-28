import { UserProfile } from "@clerk/clerk-react";

const UserPage=()=>{
    return <UserProfile path="/user" routing="path" />;
};
export default UserPage;