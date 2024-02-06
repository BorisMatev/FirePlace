﻿using FirePlace.Models.DB;

namespace FirePlace.Models.Response
{
    public class PhotoResponse
    {
        public int Id { get; set; }
        public string Base64String { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
        public int Likes { get; set; }
        public List<Category> Categories { get; set; }
    }
}
