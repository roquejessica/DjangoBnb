import { getUserId, getConversations } from "../lib/actions";
import Conversation from "../components/inbox/Conversation";

export type UserType = {
    id: string;
    name: string;
    avatar_url: string;
}

export type ConversationType = {
    id: string;
    users: UserType[];
}

const InboxPage = async () => {
    const userId = await getUserId();

    if (!userId) {
        return (
            <main className="max-w-[1500px] mx-auto px-6 py-12">
                <p>You need to be authenticated...</p>
            </main>
        )
    }

    const conversations = await getConversations()

    console.log('Conversations in page:', conversations);

    if (!Array.isArray(conversations)) {
        console.log('Conversations is not an array:', typeof conversations, conversations);
        return (
            <main className="max-w-[1500px] mx-auto px-6 pb-6">
                <h1 className="my-6 text-2xl">Inbox</h1>
                <p>No conversations found.</p>
            </main>
        );
    }
    
    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6 space-y-4">
                <h1 className="my-6 text-2xl">
                    Inbox
                </h1>

                {conversations.map((conversation: ConversationType) => {
                return (
                    <Conversation 
                        userId={userId}
                        key={conversation.id}
                        conversation={conversation}
                    />
                )
            })}
        </main>
    );
};

export default InboxPage;