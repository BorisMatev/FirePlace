using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FirePlace.Migrations
{
    public partial class Changes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CategoryPhoto");

            migrationBuilder.AddColumn<int>(
                name: "Likes",
                table: "Photos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PhotoId",
                table: "Categories",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "UserUser",
                columns: table => new
                {
                    FollowId = table.Column<int>(type: "int", nullable: false),
                    FollowersId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserUser", x => new { x.FollowId, x.FollowersId });
                    table.ForeignKey(
                        name: "FK_UserUser_Users_FollowersId",
                        column: x => x.FollowersId,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_UserUser_Users_FollowId",
                        column: x => x.FollowId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Categories_PhotoId",
                table: "Categories",
                column: "PhotoId");

            migrationBuilder.CreateIndex(
                name: "IX_UserUser_FollowersId",
                table: "UserUser",
                column: "FollowersId");

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_Photos_PhotoId",
                table: "Categories",
                column: "PhotoId",
                principalTable: "Photos",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categories_Photos_PhotoId",
                table: "Categories");

            migrationBuilder.DropTable(
                name: "UserUser");

            migrationBuilder.DropIndex(
                name: "IX_Categories_PhotoId",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "Likes",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "PhotoId",
                table: "Categories");

            migrationBuilder.CreateTable(
                name: "CategoryPhoto",
                columns: table => new
                {
                    CategoriesId = table.Column<int>(type: "int", nullable: false),
                    PhotosId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoryPhoto", x => new { x.CategoriesId, x.PhotosId });
                    table.ForeignKey(
                        name: "FK_CategoryPhoto_Categories_CategoriesId",
                        column: x => x.CategoriesId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CategoryPhoto_Photos_PhotosId",
                        column: x => x.PhotosId,
                        principalTable: "Photos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CategoryPhoto_PhotosId",
                table: "CategoryPhoto",
                column: "PhotosId");
        }
    }
}
