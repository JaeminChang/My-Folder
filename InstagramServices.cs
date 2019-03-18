using Sabio.Data.Providers;
using System;
using System.Collections.Generic;
using System.Text;
using Sabio.Web;
using Sabio.Models.Domain;
using Microsoft.Extensions.Options;
using InstaSharp;
using System.Threading.Tasks;
using Sabio.Models.Requests;
using System.Data;
using Sabio.Data;

namespace Sabio.Services
{
    public class InstagramServices : IInstagramServices
    {
        private readonly IDataProvider _dataProvider;
        private readonly IAuthenticationService<int> _authService;

        public InstagramServices(IDataProvider dataProvider, IAuthenticationService<int> authService)
        {
            _dataProvider = dataProvider;
            _authService = authService;
     
        }

        public void Create(string accessToken, int userId)
        {
            _dataProvider.ExecuteNonQuery(
                "dbo.InsertAccessTokens",
                (parameters)=>
                {
                    parameters.AddWithValue("@UserId", userId);
                    parameters.AddWithValue("@AccessToken", accessToken);
                }
                );
        }

        public void CreateInfluencer(AccessTokenAddRequest model, int userId)
        {
            _dataProvider.ExecuteNonQuery(
                "dbo.InsertAccessTokens_V2",
                (parameters)=>
                {
                    parameters.AddWithValue("@UserId", userId);
                    parameters.AddWithValue("@AccessToken", model.AccessToken);
                }
                );
        }

        public void Update(InstagramUpdateRequest model, int userId)
        {
            _dataProvider.ExecuteNonQuery(
                "dbo.InstagramUpdate",
                (parameters) =>
                {
                    parameters.AddWithValue("@UserId", userId);
                    parameters.AddWithValue("@InstagramUsername", model.InstagramUsername);
                    parameters.AddWithValue("@InstagramFollowers", model.InstagramFollowers);
                    parameters.AddWithValue("@InstagramBio", model.InstagramBio);
                    parameters.AddWithValue("@InstagramAvatar", model.InstagramAvatar);
                    parameters.AddWithValue("@InstagramFollowing", model.InstagramFollowing);
                    parameters.AddWithValue("@InstagramPosts", model.InstagramPosts);
                    parameters.AddWithValue("@InstagramFullName", model.InstagramFullName);
                }
                );
        }

        public InstagramToken Get(int userId)
        {
            InstagramToken token = null;
            _dataProvider.ExecuteCmd(
                "dbo.InstagramSelectAccessToken",
                (parameters) =>
                {
                    parameters.AddWithValue("@UserId", userId);
                },
                (reader, recordSetIndex) =>
                {
                    token = Mapper(reader);
                }
                );
            return token;
        }

        private InstagramToken Mapper(IDataReader reader)
        {
            int index = 0;
            InstagramToken token = new InstagramToken();
            token.Id = reader.GetSafeInt32(index++);
            token.UserId = reader.GetSafeInt32(index++);
            token.AccessToken = reader.GetSafeString(index++);

            return token;
        }

    }
}
