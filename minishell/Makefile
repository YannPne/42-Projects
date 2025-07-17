# Project file make with love
NAME = minishell

LIBFT = libft

FLAGS = -g -Wall -Wextra -Werror

LIB = -L/usr/include -lreadline

SRCS = srcs/envvar.c \
       srcs/echo.c \
       srcs/echo_str.c \
       srcs/export.c \
       srcs/parsing.c \
       srcs/path.c \
       srcs/main.c \
       srcs/redirect.c \
       srcs/pipe.c \
       srcs/sigint.c \
       srcs/utils.c

OBJS = $(SRCS:.c=.o)

CC = gcc

all: $(NAME)

$(NAME): $(OBJS)
	@make -C $(LIBFT)
	$(CC) $(FLAGS) -I header/ $(OBJS) $(LIBFT)/libft.a -o $(NAME) $(LIB)

%.o: %.c
	$(CC) $(FLAGS) -c $< -o $@ -I header/

clean:
	@make clean -C $(LIBFT)
	rm -f $(OBJS)

fclean: clean
	rm -f $(NAME)
	@make fclean -C $(LIBFT)

re: fclean all

.PHONY: all clean fclean re
