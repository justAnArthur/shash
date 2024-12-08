import { api } from "boot/axios";
import type { Router } from "vue-router";
import { updateChatMine } from "src/app/components/chat-list.store";

export const commands = ({
  router,
  context: { chat, userId },
}: {
  router: Router;
  context: any;
}) => {
  return [
    {
      slash: "/join",
      parameters: ["chatName", "privatePublic"],
      suggestions: async (chatName?: string, privatePublic?: string) => {
        if (chatName === undefined) {
          return [
            {
              text: "/join [chatName] [private]",
            },
          ];
        }

        if (privatePublic === undefined) {
          privatePublic = "public";
        }

        if (privatePublic !== "private" && privatePublic !== "public") {
          return [
            {
              text: "/join [chatName] [private]",
            },
          ];
        }

        const { data: chats } = await api.get(
          "/chat/public?search=" + chatName,
        );

        if (chats.length > 0) {
          const existingChat = chats[0];

          if (!existingChat.isPrivate) {
            return [
              {
                text: `Join ${existingChat.channelName}`,
                onEnter: async () => {
                  await api.post("/chat/join/" + existingChat.id);
                  await updateChatMine();
                  return { clear: true };
                },
              },
            ];
          }

          return [
            {
              text: `Chat ${existingChat.channelName} is private. No action taken.`,
            },
          ];
        }

        const isPrivate = privatePublic === "private";
        return [
          {
            text: `Create ${chatName} as ${privatePublic} channel`,
            onEnter: async () => {
              const { data } = await api.put("/chat/create", {
                chatName,
                isPrivate,
              });
              await updateChatMine();
              await router.push("/chats/" + data.chat.id);
              return { clear: true };
            },
          },
        ];
      },
      visible: true,
    },
    {
      slash: "/invite",
      parameters: ["query"],
      suggestions: async (query?: string) => {
        if (!query || query.length < 5)
          return [
            {
              text: "/invite [user:{5,}]",
            },
          ];

        return (
          await api.get("/user/byQuery/" + query).then(({ data }) => data)
        )
          .filter((user: any) => user.id !== userId)
          .map((user: any) => {
            return {
              text: user.name + " " + user.surname,
              onEnter: async () => {
                await api.post("/chat/invite", {
                  userId: user.id,
                  chatId: chat.id,
                });
                return { clear: true };
              },
            };
          });
      },
      visible:
        !!chat && (chat.isPrivate === false || chat.userOwnerId === userId),
    },
    {
      slash: "/kick",
      parameters: ["query"],
      suggestions: async (query?: string) => {
        if (!query || query.length < 5)
          return [
            {
              text: "/kick [user:{5,}]",
            },
          ];

        return (
          await api.get("/user/byQuery/" + query).then(({ data }) => data)
        )
          .filter((user: any) => user.id !== userId)
          .map((user: any) => {
            return {
              text: user.name + " " + user.surname,
              onEnter: async () => {
                await api.post("/chat/kick", {
                  userId: user.id,
                  chatId: chat.id,
                });
                return { clear: true };
              },
            };
          });
      },
      visible: !!chat,
    },
    {
      slash: "/resolve",
      parameters: ["query"],
      suggestions: async (query?: string) => {
        if (!query || query.length < 5)
          return [
            {
              text: "/resolve [user:{5,}]",
            },
          ];

        return (
          await api.get("/user/byQuery/" + query).then(({ data }) => data)
        )
          .filter((user: any) => user.id !== userId)
          .map((user: any) => {
            return {
              text: user.name + " " + user.surname,
              onEnter: async () => {
                await api.post("/chat/kick/resolve", {
                  userId: user.id,
                  chatId: chat.id,
                });
                return { clear: true };
              },
            };
          });
      },
      visible: !!chat && chat.userOwnerId === userId,
    },
    {
      slash: "/revoke",
      parameters: ["query"],
      suggestions: async (query?: string) => {
        if (!query || query.length < 2)
          return [
            {
              text: "/revoke [user:{2,}]",
            },
          ];

        return (
          await api
            .get(`/chat/${chat.id}/users?query=` + query)
            .then(({ data }) => data)
        )
          .filter((user: any) => user.id !== userId)
          .map((user: any) => {
            return {
              text: user.name + " " + user.surname,
              onEnter: async () => {
                await api.post("/chat/revoke ", {
                  userId: user.id,
                  chatId: chat.id,
                });
                return { clear: true };
              },
            };
          });
      },
      visible: !!chat && chat.userOwnerId === userId,
    },
    {
      slash: "/cancel",
      parameters: [],
      suggestions: async () => {
        return [
          {
            text: "Delete or quit chat",
            onEnter: async () => {
              await api.delete(`/chat/${chat.id}?quit=false`);
              await updateChatMine();
              await router.push("/chats/");
              return { clear: true };
            },
          },
        ];
      },
      visible: !!chat,
    },
    {
      slash: "/quit",
      parameters: [],
      suggestions: async () => {
        return [
          {
            text: "Delete chat (chat owner only)",
            onEnter: async () => {
              await api.delete(`/chat/${chat.id}?quit=true`);
              await updateChatMine();
              await router.push("/chats/");
              return { clear: true };
            },
          },
        ];
      },
      visible: !!chat && chat.userOwnerId === userId,
    },
    {
      slash: "/list",
      parameters: [],
      suggestions: async () => {
        const { data: members } = await api.get("/user/byChat/" + chat.id);

        return members.map((member: any) => ({
          text: `${member.nickname} - ${member.name} ${member.surname}`,
        }));
      },
      visible: !!chat,
    },
  ].filter((command) => command.visible !== false);
};
