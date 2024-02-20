using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FirePlace.Migrations
{
    public partial class Followers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserUser_Users_FollowersId",
                table: "UserUser");

            migrationBuilder.DropForeignKey(
                name: "FK_UserUser_Users_FollowId",
                table: "UserUser");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserUser",
                table: "UserUser");

            migrationBuilder.DropIndex(
                name: "IX_UserUser_FollowersId",
                table: "UserUser");

            migrationBuilder.RenameColumn(
                name: "FollowId",
                table: "UserUser",
                newName: "FollowingId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserUser",
                table: "UserUser",
                columns: new[] { "FollowersId", "FollowingId" });

            migrationBuilder.CreateIndex(
                name: "IX_UserUser_FollowingId",
                table: "UserUser",
                column: "FollowingId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserUser_Users_FollowersId",
                table: "UserUser",
                column: "FollowersId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserUser_Users_FollowingId",
                table: "UserUser",
                column: "FollowingId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserUser_Users_FollowersId",
                table: "UserUser");

            migrationBuilder.DropForeignKey(
                name: "FK_UserUser_Users_FollowingId",
                table: "UserUser");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserUser",
                table: "UserUser");

            migrationBuilder.DropIndex(
                name: "IX_UserUser_FollowingId",
                table: "UserUser");

            migrationBuilder.RenameColumn(
                name: "FollowingId",
                table: "UserUser",
                newName: "FollowId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserUser",
                table: "UserUser",
                columns: new[] { "FollowId", "FollowersId" });

            migrationBuilder.CreateIndex(
                name: "IX_UserUser_FollowersId",
                table: "UserUser",
                column: "FollowersId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserUser_Users_FollowersId",
                table: "UserUser",
                column: "FollowersId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserUser_Users_FollowId",
                table: "UserUser",
                column: "FollowId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
