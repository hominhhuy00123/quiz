using Microsoft.EntityFrameworkCore.Migrations;

namespace Quiz.Migrations
{
    public partial class AddCreatedByUserToGame2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlayerScores_Users_UserId",
                table: "PlayerScores");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "PlayerScores",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddColumn<string>(
                name: "PlayerName",
                table: "PlayerScores",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_PlayerScores_Users_UserId",
                table: "PlayerScores",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlayerScores_Users_UserId",
                table: "PlayerScores");

            migrationBuilder.DropColumn(
                name: "PlayerName",
                table: "PlayerScores");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "PlayerScores",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_PlayerScores_Users_UserId",
                table: "PlayerScores",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
