using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FirePlace.Migrations
{
    public partial class ctegories : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categories_Photos_PhotoId",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Categories_PhotoId",
                table: "Categories");

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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CategoryPhoto");

            migrationBuilder.AddColumn<int>(
                name: "PhotoId",
                table: "Categories",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_PhotoId",
                table: "Categories",
                column: "PhotoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_Photos_PhotoId",
                table: "Categories",
                column: "PhotoId",
                principalTable: "Photos",
                principalColumn: "Id");
        }
    }
}
