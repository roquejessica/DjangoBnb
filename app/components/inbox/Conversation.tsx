import Link from "next/link";
import { ConversationType } from "../../inbox/page";

interface ConversationProps {
    userId: string;
    conversation: ConversationType;
}

const Conversation = ({
    conversation,
    userId
}: ConversationProps) => {
    const otherUser = conversation.users.find((user) => user.id != userId)
    return (
        <Link href={`/inbox/${conversation.id}`}>
            <div className="px-6 py-4 cursor-pointer border border-gray-300 rounded-xl">
                <p className="mb-6 text-xl">{otherUser?.name}</p>

                <p className="text-airbnb-dark">
                    Go to conversation
                </p>
            </div>
        </Link>
    )
}

export default Conversation