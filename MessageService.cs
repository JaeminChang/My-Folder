﻿using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Sabio.Services
{
    public class MessageService : IMessageService
    {
        private readonly IDataProvider _dataProvider;

        public MessageService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        public int Create(MessageAddRequest req, int userId)
        {
            int id = 0;
            _dataProvider.ExecuteNonQuery("dbo.UserMessages_Insert", (parameters) =>
            {
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@Id";
                param.SqlDbType = SqlDbType.Int;
                param.Direction = ParameterDirection.Output;
                parameters.Add(param);

                parameters.AddWithValue("@ConversationId", req.ConversationId);
                parameters.AddWithValue("@Body", req.Body);
                parameters.AddWithValue("@UserId", userId);
            },
            (returnParams) =>
            {
                Int32.TryParse(returnParams["@Id"].Value.ToString(), out id);
            }
            );

            return id;
        }

        public int SendMsgToRecepient(MessageRecepientAddRequest repAdd)
        {
            int id = 0;
            _dataProvider.ExecuteNonQuery("dbo.UserMessageRecepients_Insert", (parameters) =>
            {
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@Id";
                param.SqlDbType = SqlDbType.Int;
                param.Direction = ParameterDirection.Output;
                parameters.Add(param);

                parameters.AddWithValue("@ConversationId", repAdd.ConversationId);
                parameters.AddWithValue("@MessageId", repAdd.MessageId);
                parameters.AddWithValue("@UserId", repAdd.TargetUserId);
                parameters.AddWithValue("@Read", repAdd.Read);
            }, (returnParams) =>
            {
                Int32.TryParse(returnParams["@Id"].Value.ToString(), out id);
            });

            return id;
        }

        public List<Message> Get()
        {
            List<Message> messages = null;
            _dataProvider.ExecuteCmd("dbo.UserMessages_SelectAll", null, (reader, shortSetIndex) =>
            {
                Message message = Mapper(reader);
                if (messages == null)
                {
                    messages = new List<Message>();
                }
                messages.Add(message);
            });

            return messages;
        }

        public Message Get(int id)
        {
            Message message = null;
            _dataProvider.ExecuteCmd("dbo.UserMessages_SelectById_V2", (parameters) =>
            {
                parameters.AddWithValue("@Id", id);
            },
            (reader, shortSetIndex) =>
            {
                message = Mapper(reader);
            });

            return message;
        }

        public List<Message> GetMessagesByConversationId(int conversationId)
        {
            List<Message> messages = null;
            _dataProvider.ExecuteCmd("dbo.UserMessages_SelectByConversationId_V2", (parameters) =>
            {
                parameters.AddWithValue("@ConversationId", conversationId);
            },
            (reader, shortSetIndex) =>
            {
                Message message = Mapper(reader);
                if (messages == null)
                {
                    messages = new List<Message>();
                }
                messages.Add(message);
            });

            return messages;
        }

        public List<ConversationParticipant> GetUserProfileConversation(int userId)
        {
            List<ConversationParticipant> participants = null;
            _dataProvider.ExecuteCmd(

                "dbo.UserConversations_SelectUserInfoAndRecentMessage",
 
                (paramCol) =>
                {
                    paramCol.AddWithValue("@UserId", userId);
                },
                (reader, set) =>
                {
                    int startingIndex = 0;


                    ConversationParticipant participant = new ConversationParticipant();



                    participant.UserId = reader.GetSafeInt32(startingIndex++);
                    participant.ParticipantId = reader.GetSafeInt32(startingIndex++);
                    participant.CurrentId = reader.GetSafeInt32(startingIndex++);
                    participant.ConversationId = reader.GetSafeInt32(startingIndex++);
                    participant.FirstName = reader.GetSafeString(startingIndex++);
                    participant.LastName = reader.GetSafeString(startingIndex++);
                    participant.AvatarUrl = reader.GetSafeString(startingIndex++);
                    participant.Body = reader.GetSafeString(startingIndex++);
                    participant.TimeSent = reader.GetSafeDateTime(startingIndex++);


                    if (participants == null)
                    {
                        participants = new List<ConversationParticipant>();
                    }
                    participants.Add(participant);
                }
                );

            return participants;
        }

        public ConversationParticipant GetParticipantInfo(int userId, int recepientId)
        {
            ConversationParticipant participant = new ConversationParticipant();
            _dataProvider.ExecuteCmd(

                "dbo.UserConversations_SelectUserInfoAndRecentMessage_V2",
 
                (paramCol) =>
                {
                    paramCol.AddWithValue("@UserId", userId);
                    paramCol.AddWithValue("@RecepientId", recepientId);
                },
                (reader, recordSetIndex) =>
                {
                    int startingIndex = 0;

              
                 
                    participant.UserId = reader.GetSafeInt32(startingIndex++);
                    participant.ParticipantId = reader.GetSafeInt32(startingIndex++);
                    participant.CurrentId = reader.GetSafeInt32(startingIndex++);
                    participant.ConversationId = reader.GetSafeInt32(startingIndex++);
                    participant.FirstName = reader.GetSafeString(startingIndex++);
                    participant.LastName = reader.GetSafeString(startingIndex++);
                    participant.AvatarUrl = reader.GetSafeString(startingIndex++);
                    participant.Body = reader.GetSafeString(startingIndex++);
                    participant.DateCreated = reader.GetSafeDateTime(startingIndex++);
                   
                }
                );

            return participant;
        }

        public List<UserProfile> SearchUserProfilesToAdd(string search)
        {
            List<UserProfile> results = null;
            _dataProvider.ExecuteCmd("dbo.UserProfiles_Search", (parameters) =>
            {
                parameters.AddWithValue("@Search", search);
            }, (reader, shortSetIndex) =>
            {
                UserProfile user = UserProfileMapper(reader);

                if (results == null)
                {
                    results = new List<UserProfile>();
                }

                results.Add(user);
            });

            return results;
        }

        public UserProfile SelectUserToAdd(int userId)
        {
            UserProfile user = null;
            _dataProvider.ExecuteCmd("dbo.UserProfiles_SelectUserProfileToAddToConvo", (parameters) =>
            {
                parameters.AddWithValue("@UserId", userId);
            },
            (reader, shortSetIndex) =>
            {
                user = SelectUserProfileMapper(reader);
            });

            return user;
        }

        private UserProfile SelectUserProfileMapper(IDataReader reader)
        {
            UserProfile user = new UserProfile();
            int index = 0;

            user.UserId = reader.GetSafeInt32(index++);
            user.FirstName = reader.GetSafeString(index++);
            user.LastName = reader.GetSafeString(index++);
            user.Email = reader.GetSafeString(index++);
            user.AvatarUrl = reader.GetSafeString(index++);
            user.Description = reader.GetSafeString(index++);
            user.DOB = reader.GetSafeDateTime(index++);
            user.PhoneNumber = reader.GetSafeString(index++);
            user.MilestoneId = reader.GetSafeInt32(index++);

            return user;
        }

        private UserProfile UserProfileMapper(IDataReader reader)
        {
            UserProfile user = new UserProfile();
            int index = 0;

            user.Id = reader.GetSafeInt32(index++);
            user.FirstName = reader.GetSafeString(index++);
            user.LastName = reader.GetSafeString(index++);
            user.Email = reader.GetSafeString(index++);
            user.AvatarUrl = reader.GetSafeString(index++);
            user.Description = reader.GetSafeString(index++);
            user.DOB = reader.GetSafeDateTime(index++);
            user.PhoneNumber = reader.GetSafeString(index++);
            user.UserId = reader.GetSafeInt32(index++);
            user.MilestoneId = reader.GetSafeInt32(index++);

            return user;
        }

        private Message Mapper(IDataReader reader)
        {
            Message message = new Message();

            int index = 0;

            message.Id = reader.GetSafeInt32(index++);
            message.ConversationId = reader.GetSafeInt32(index++);
            message.Body = reader.GetSafeString(index++);
            message.UserId = reader.GetSafeInt32(index++);
            message.DateCreated = reader.GetSafeDateTime(index++);
            message.DateModified = reader.GetSafeDateTime(index++);
            message.FirstName = reader.GetSafeString(index++);
            message.LastName = reader.GetSafeString(index++);
            message.AvatarUrl = reader.GetSafeString(index++);

            return message;
        }

        #region conversation services 
        public int CreateConversation(Guid name, int userId)
        {
            int id = 0;

            _dataProvider.ExecuteNonQuery("dbo.UserConversations_Insert", (parameters) =>
            {
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@Id";
                param.SqlDbType = SqlDbType.Int;
                param.Direction = ParameterDirection.Output;
                parameters.Add(param);

                parameters.AddWithValue("@Name", name);
                parameters.AddWithValue("@CreatedBy", userId);
            },
            (returnParams) =>
            {
                Int32.TryParse(returnParams["@Id"].Value.ToString(), out id);
            }
            );
            return id;
        }

        public void TwoWayAddConversationParticipants(ConversationParticipantAddRequest sender,
            ConversationParticipantAddRequest recepient)
        {
            _dataProvider.ExecuteNonQuery("dbo.UserConversationParticipants_Insert", (parameters) =>
            {
                parameters.AddWithValue("@ConversationId", sender.ConversationId);
                parameters.AddWithValue("@UserId", sender.UserId);
            });

            _dataProvider.ExecuteNonQuery("dbo.UserConversationParticipants_Insert", (parameters) =>
            {
                parameters.AddWithValue("@ConversationId", recepient.ConversationId);
                parameters.AddWithValue("@UserId", recepient.UserId);
            });
        }

        public List<Conversation> GetConversations(int userId)
        {
            List<Conversation> conversations = null;
            _dataProvider.ExecuteCmd("dbo.UserConversations_SelectAll", (parameters) =>
            {
                parameters.AddWithValue("@CreatedBy", userId);
            },
            (reader, shortSetIndex) =>
            {
                Conversation conversation = ConversationMapper(reader);
                if (conversations == null)
                {
                    conversations = new List<Conversation>();
                }
                conversations.Add(conversation);
            });

            return conversations;
        }

        public Conversation GetConversation(int id)
        {
            Conversation conversation = null;
            _dataProvider.ExecuteCmd("dbo.UserConversations_SelectById", (parameters) =>
            {
                parameters.AddWithValue("@Id", id);
            },
            (reader, shortSetIndex) =>
            {
                conversation = ConversationMapper(reader);
            });

            return conversation;
        }

        public List<ConversationParticipant> GetConversationThreads(int userId)
        {
            List<ConversationParticipant> threads = null;
            _dataProvider.ExecuteCmd("dbo.UserConversations_SelectConversationsByUserId_V2", (parameters) =>
            {
                parameters.AddWithValue("@UserId", userId);
            },
            (reader, shortSetIndex) =>
            {
                ConversationParticipant thread = ConversationThreadMapper(reader);
                if (threads == null)
                {
                    threads = new List<ConversationParticipant>();
                }
                threads.Add(thread);
            });

            return threads;
        }

        public void DeleteConversationsAndMessages(int conversationId)
        {
            _dataProvider.ExecuteNonQuery("dbo.UserConversations_Delete", (parameters) =>
            {
                parameters.AddWithValue("@Id", conversationId);
            });
        }

        private ConversationParticipant ConversationThreadMapper(IDataReader reader)
        {
            ConversationParticipant threads = new ConversationParticipant();
            int index = 0;

            threads.ParticipantId = reader.GetSafeInt32(index++);
            threads.ConversationId = reader.GetSafeInt32(index++);
            threads.FirstName = reader.GetSafeString(index++);
            threads.LastName = reader.GetSafeString(index++);
            threads.AvatarUrl = reader.GetSafeString(index++);

            return threads;
        }

        private Conversation ConversationMapper(IDataReader reader)
        {
            Conversation conversation = new Conversation();
            int index = 0;

            conversation.Id = reader.GetSafeInt32(index++);
            conversation.Name = reader.GetSafeGuid(index++);
            conversation.CreatedBy = reader.GetSafeInt32(index++);
            conversation.DateCreated = reader.GetSafeDateTime(index++);

            return conversation;
        }
        #endregion 

    }
}
