CC = gcc
CFLAGS = -Wall -Wextra -Werror

NAME = pipex

SRC = pipex.c pipex_utils.c
OBJ = $(SRC:.c=.o)

HEADER = headers

all: $(NAME)

$(NAME): $(OBJ)
	$(CC) $(CFLAGS) -I$(HEADER) -o $(NAME) $(OBJ)

%.o: %.c
	$(CC) $(CFLAGS) -I$(HEADER) -c $< -o $@

clean:
	rm -f $(OBJ)

fclean: clean
	rm -f $(NAME)

re: fclean all

.PHONY: all clean fclean re
