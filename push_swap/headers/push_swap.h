/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   push_swap.h                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <ypanares@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/02/05 10:51:19 by ypanares          #+#    #+#             */
/*   Updated: 2024/02/07 09:10:30 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef PUSH_SWAP_H
# define PUSH_SWAP_H

# ifndef BUFFER_SIZE
#  define BUFFER_SIZE 1000
# endif

# include <stdlib.h>
# include <stddef.h>
# include <unistd.h>
# include <fcntl.h>

typedef struct s_list
{
	int				content;
	int				index;
	int				pos;
	int				rrab;
	int				rraplage;
	int				posplage;
	int				cost;
	struct s_list	*next;
}					t_list;
t_list		*ft_lstnew(int content);

void		ft_push_swap(int argc, char **argv);
char		**ft_hubverif(int argc, char **argv, char **tabarg, int i);
int			ft_checkordre(t_list **a);
long long	ft_atoi(char *ptr);
void		ft_videa(t_list **a, t_list **b, int size, int medium);
void		ft_indexation(t_list **li);
int			ft_size(t_list **li);
int			ft_doublecheck(char **tabarg);
int			ft_strcmp(char *s1, char *s2);
void		freearg(char **tabarg);
void		ft_hublist(t_list **temp);
char		**ft_duparg(int argc, char **argv);
char		*ft_strdup(char *s);
int			ft_strchr(char *argv);
int			ft_intmax(char *s);
int			ft_strlen(char	*c);
void		ft_addback(t_list **lst, t_list *new);
int			ft_error(char *argv);
char		**ft_split(char const *s, char c);
char		*ft_strncpy(char *dest, char *src, int n);
int			countword(char const *s, char c);
char		**tabc(char **tab, const char *s, char c);
void		*ft_calloc(size_t nmemb, size_t size);
void		ft_bzero(void *s, size_t n);
void		ft_middlealgo(t_list **a, t_list **b);
int			choicenode(t_list **b, int compteur);
void		checkcostb(t_list **b);
void		checkplage(t_list **a, t_list **b, t_list *temp);
void		poslist(t_list **list, int srclist, int size, int i);
void		ft_align(t_list **a);
void		assemble_pos(t_list **a, t_list **b);
void		assemble_algo(t_list **a, t_list **b, int i);
void		ft_pa(t_list **a, t_list **b);
void		ft_middlealgo(t_list **a, t_list **b);
void		ft_ifrrr(t_list **a, t_list **b, t_list *tempb);
void		ft_exclista(t_list **a, t_list *tempb);
void		ft_exclistb(t_list **b, t_list *tempb);
void		ft_startalgo(t_list **a, int size);
void		ft_three(t_list **a);
void		ft_two(t_list **a);
void		ft_freelist(t_list **a);
void		ft_sa(t_list **lst);
void		ft_pa(t_list **a, t_list **b);
void		ft_ra(t_list **a);
void		ft_rra(t_list **a);
void		ft_sb(t_list **b);
void		ft_pb(t_list **b, t_list **a);
void		ft_rb(t_list **b);
void		ft_rrb(t_list **b);
void		ft_ss(t_list **a, t_list **b);
void		ft_rr(t_list **a, t_list **b);
void		ft_rrr(t_list **a, t_list **b);

void		get_term(t_list **a);
int			readline(char *line, t_list **a, t_list **b, int i);
void		checker(int argc, char **argv);
void		instrucp(int *i, char *line, t_list **a, t_list **b);
void		instrucr(int *i, char *line, t_list **a, t_list **b);
void		instrucrr(int *i, char *line, t_list **a, t_list **b);
void		instrucs(int *i, char *line, t_list **a, t_list **b);

char		*ft_verif(char *s, int i, int j, int fin);
char		*get_next_line(int fd);
char		*readfile(int fd);
int			ft_verifn(char *src);
char		*ft_dupafter(char *src);
char		*ft_dup(char *src, int fin);
int			ftr_strlen(char *s);
char		*f_strjoin(char *s1, char *s2);
char		*ft_join(char *stock, char *buffer);

#endif
