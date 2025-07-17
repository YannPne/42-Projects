CC = gcc

CFLAGS = -Wall -Werror -Wextra

NAME = libftprintf.a

SRC =	ft_printf.c ft_printf_convert.c

OBJ = $(SRC:.c=.o)

all : $(NAME)

%.o : %.c
	$(CC) $(CFLAGS) -o $@ -c $<

$(NAME) : $(OBJ)
	ar rcs $(NAME) $(OBJ)


clean :
	rm -rf $(OBJ) 

fclean : clean
	rm -rf $(NAME)

re : clean all

