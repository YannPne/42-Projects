NAME = cub3D

SRCS = src/main.c src/parse3.c src/parse2.c src/raycasting_utils.c src/key_utils.c src/raycasting.c src/exit.c src/init.c src/key.c src/parse.c src/textures.c libs/get_next_line/get_next_line.c libs/get_next_line/get_next_line_utils.c

LIBFT = libs/libft/libft.a
MLX = libs/minilibx-linux/libmlx.a
MLX_FLAGS = -Llibs/minilibx-linux -lmlx -lXext -lX11 -lm

OBJS = $(SRCS:.c=.o)

CC = gcc -g
CFLAGS = -Wall -Wextra -Werror

all: $(NAME)

$(NAME): $(OBJS) $(LIBFT)
	$(CC) $(CFLAGS) -o $(NAME) $(OBJS) $(LIBFT) -Llibs/minilibx-linux -lmlx -lXext -lX11 -lm

clean:
	rm -f $(OBJS)

fclean: clean
	rm -f $(NAME)

re: fclean all

.PHONY: all clean fclean re
