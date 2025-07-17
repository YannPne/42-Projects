CC = gcc

CFLAGS = -Wall -Wextra -g3

NAME = so_long

SRCS = so_long.c check.c init.c write.c move.c

OBJ = $(SRCS:.c=.o)

all     :   $(NAME)

$(NAME) :   $(OBJ)
	$(MAKE) -C minilibx
	$(MAKE) -C ft_printf
	$(CC) $(CFLAGS) $(OBJ) -o $(NAME) -L./minilibx/ ./GNL/*.c ./ft_printf/*.c -lmlx -lXext -lX11 -lm
clean	:
	$(MAKE) -C minilibx clean
	$(MAKE) -C ft_printf clean
	rm -rf $(OBJ)
fclean	:	clean
	rm -f $(NAME)

re	:	fclean all

.PHONY	:	clean fclean all re 
