using Sabio.Models.Domain;
using Sabio.Models.Requests;

namespace Sabio.Services
{
    public interface IInstagramServices
    {
        void Create(string accessToken, int userId);

        InstagramToken Get(int id);

        void Update(InstagramUpdateRequest model, int userId);
    }
}