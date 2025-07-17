SRCS = src/push_swap.c\
				src/main.c\
				src/ft_split.c\
				src/ft_calloc.c\
				src/push_utils1.c\
				src/push_utils2.c\
				src/push_verif.c\
				src/small_sort.c\
				src/pos_list.c\
				src/exe_algo.c\
				src/assemble_algo.c\
				src/instruca.c\
				src/instrucab.c\
				src/instrucb.c\

BONUS =	src/checker.c\
				src/push_swap.c\
				src/ft_split.c\
				src/ft_calloc.c\
				src/push_utils1.c\
				src/push_utils2.c\
				src/push_verif.c\
				src/small_sort.c\
				src/pos_list.c\
				src/exe_algo.c\
				src/assemble_algo.c\
				src/instruca_checker.c\
				src/instrucab_checker.c\
				src/instrucb_checker.c\
				src/ifinstruc_checker.c\
				src/get_next_line.c\
				src/get_next_line_utils.c\

OBJS = $(SRCS:.c=.o)

BOBJS = $(BONUS:.c=.o)


CC = gcc
CFLAGS = -Wall -Wextra -Werror -g
NAME = push_swap
NAMEB = checker

all: $(NAME)

$(NAME): $(OBJS)
	$(CC) $(CFLAGS) $(OBJS) -o $(NAME)

bonus: $(NAMEB)

$(NAMEB): $(BOBJS)
	$(CC) $(CFLAGS) $(BOBJS) -o $(NAMEB)

%.o : %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS) $(BOBJS)

fclean: clean
	rm -f $(NAME) $(NAMEB)

re: fclean all

.PHONY : all clean fclean re
