﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class InstagramToken
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string AccessToken { get; set; }
    }
}
