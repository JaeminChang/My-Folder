using InstaSharp;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RestSharp;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/instagram")]
    [ApiController]
    public class InstagramController : BaseApiController
    {
        private readonly IInstagramServices _instagramService;
        private readonly IAuthenticationService<int> _authService;

        public InstagramController(IInstagramServices instagramService, IAuthenticationService<int> authService, ILogger<SmsApiController> logger) : base(logger)
        {
            _instagramService = instagramService;
            _authService = authService;

        }

        //[HttpGet]
        //public string AccessToken(string code)
        //{
            
        //        var client = new RestClient("https://api.instagram.com/oauth/access_token");
        //        var request = new RestRequest(Method.POST);
        //        request.AddParameter("client_id", "8b9252bfd9174c99a5528f0454d82298");
        //        request.AddParameter("client_secret", "e200d2a21e1e48ca8d525a1f7d014225");
        //        request.AddParameter("grant_type", "authorization_code");
        //        request.AddParameter("redirect_uri", "https://localhost:3000/ig/redirect");
        //        request.AddParameter("code", code);
        //        IRestResponse accessToken = client.Execute(request);
        //        var data = accessToken.Content;

                
        //    return data;
        //}

        [HttpGet]
        public string AccessToken(string code)
        {
                var client = new RestClient("https://api.instagram.com/oauth/access_token");
                var request = new RestRequest(Method.POST);
                request.AddParameter("client_id", "8b9252bfd9174c99a5528f0454d82298");
                request.AddParameter("client_secret", "e200d2a21e1e48ca8d525a1f7d014225");
                request.AddParameter("grant_type", "authorization_code");
                request.AddParameter("redirect_uri", "https://localhost:3000/ig/redirect");
                request.AddParameter("code", code);
                IRestResponse accessToken = client.Execute(request);
                var data = accessToken.Content;
                
                return data;
        }

        [HttpPut]
        public ActionResult<SuccessResponse> Update(InstagramUpdateRequest model)
        {
            ActionResult result = null;
            int userId = _authService.GetCurrentUserId();
            try
            {
                _instagramService.Update(model, userId);
                SuccessResponse response = new SuccessResponse();
                result = Ok200(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());

                result = StatusCode(500, ex.ToString());
            }
            return result;
        }

        [HttpGet("instafeed")]
        public string InstaFeed(string token)
        {
            
                var client = new RestClient("https://api.instagram.com/v1/users/self/media/recent/?access_token=" + token);
                var request = new RestRequest(Method.GET);
                request.AddParameter("ACCESS_TOKEN", token);
                request.AddParameter("MAX_ID", "15");
                request.AddParameter("MIN_ID", "0");
                request.AddParameter("COUNT", "50");
                IRestResponse accessToken = client.Execute(request);
                var data = accessToken.Content;

                return data;
            
        }

        [HttpGet("followers")]
        public string InstaFollowers(string token)
        {
            var client = new RestClient("https://api.instagram.com/v1/users/self/?access_token=" + token);
            var request = new RestRequest(Method.GET);
            request.AddParameter("ACCESS_TOKEN", token);
            IRestResponse information = client.Execute(request);
            var data = information.Content;

            return data;
        }

        [HttpPost("accesstoken")]
        public ActionResult<SuccessResponse> Insert(string accessToken)
        {
            ActionResult result = null;
            int userId = _authService.GetCurrentUserId();
            try
            {

                _instagramService.Create(accessToken, userId);
                SuccessResponse response = new SuccessResponse();
                result = Ok200(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());

                result = StatusCode(500, ex.ToString());
            }
            return result;
        }

        [HttpPost("influencer")]
        public ActionResult<SuccessResponse> InsertInfluencer(string accessToken)
        {
            ActionResult result = null;
            int userId = _authService.GetCurrentUserId();
            try
            {

                _instagramService.Create(accessToken, userId);
                SuccessResponse response = new SuccessResponse();
                result = Ok200(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());

                result = StatusCode(500, ex.ToString());
            }
            return result;
        }

        [HttpGet("accesstoken")]
        public ActionResult<ItemResponse<InstagramToken>> Get()
        {
            ItemResponse<InstagramToken> response = null;
            ActionResult result = null;
            int userId = _authService.GetCurrentUserId();
            try
            {
                InstagramToken token = _instagramService.Get(userId);

                if (token.AccessToken == "undefined")
                {
                    result = NotFound404(new ErrorResponse("Doesn't Exist"));
                }
                else
                {
                    response = new ItemResponse<InstagramToken>();
                    response.Item = token;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());

                result = StatusCode(500, new ErrorResponse(ex.Message));
            }

            return result;
        }

        [HttpGet("influencer")]
        public ActionResult<ItemResponse<InstagramToken>> GetInfluencer(int userId)
        {
            ItemResponse<InstagramToken> response = null;
            ActionResult result = null;
            try
            {
                InstagramToken token = _instagramService.Get(userId);

                if (token == null)
                {
                    result = NotFound404(new ErrorResponse("Doesn't Exist"));
                }
                else
                {
                    response = new ItemResponse<InstagramToken>();
                    response.Item = token;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());

                result = StatusCode(500, new ErrorResponse(ex.Message));
            }
            return result;
        }

        //[HttpPut("accesstoken")]
        //public ActionResult<SuccessResponse> Update(AccessTokenAddRequest model)
        //{
        //    ActionResult result = null;
        //    int userId = _authService.GetCurrentUserId();
        //    try
        //    {
        //        _instagramService.Update(model, userId);
        //        SuccessResponse response = new SuccessResponse();
        //        result = Ok200(response);
        //    }
        //    catch (Exception ex)
        //    {
        //        Logger.LogError(ex.ToString());

        //        result = StatusCode(500, ex.ToString());
        //    }
        //    return result;
        //}

    }
}
