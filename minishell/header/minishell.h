/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pipe.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/23 18:37:15 by ypanares          #+#    #+#             */
/*   Updated: 2024/07/23 18:37:18 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef MINISHELL_H
# define MINISHELL_H

# include <stdlib.h>
# include <string.h>
# include <readline/readline.h>
# include <readline/history.h>
# include <sys/wait.h>
# include <stdio.h>
# include <signal.h>
# include <unistd.h>
# include <limits.h>
# include <fcntl.h>
# include <stdbool.h>
# include "../libft/libft.h"

extern int	g_signal_global;

typedef struct s_envvar
{
	bool			global;
	char			*key;
	char			*value;
	struct s_envvar	*next;
}			t_env_var;

typedef struct s_poubelle
{
	int		s_q;
	int		d_q;
	int		i;
	int		j;
	char	*args[20];
	char	*token;
	int		arg_count;
	int		pipes[150][2];
	pid_t	pids[150];
}			t_poubelle;

int			str_in_str(char *src, const char *dest);
int			redirect_input(char *input, char *metachar,
				t_env_var *env, int m_redirect);
int			metacaractere(char c);
int			metacaractere_minishell(char c);
int			meta_echo(t_env_var *env, char *input, char *s_parsing);
int			multiple_redirect(char *input, char *metachar, int len,
				int first_meta);
int			param_echo(int *s_quote, int *d_quote, char *input, int i);

char		*echo_str(t_env_var *env, char *input, int i, int retour_l);
char		*second_parsing(char *input);
char		*check_folder_redirect_input(char *input, char *meta, int i);
char		*check_folder_redirect_input_double(char *input, char *meta);
char		*retour_ligne(char *src, int retour_ligne);
char		*echo_str_in_var2(t_env_var *env,
				char *input, int ret, char *key_name);
char		*name_key(char *input);
char		*find_cmd(char *cmd);
void		param_echo2(int *s_quote, int *d_quote, char *input, int *i);
void		handle_sigint(int sig);
void		export(t_env_var *env, char *input);
void		echo(t_env_var *env, char *input, char *s_parsing);
void		pwd(void);
void		cd(char *input);
void		environnement_var(char *input, t_env_var *envvar, bool global);
void		instru(char *input, t_env_var **envvar, char *afree);
void		add_node(t_env_var *init_envvar,
				char *key, char *value, bool global);
void		set_var(t_env_var *env, char *key, char *value, bool global);
void		env(t_env_var *env);
void		put_env_list(t_env_var *env, char **environ);
void		unset(char *input, t_env_var *env);
void		execute_pipeline(char **commands, int pipe_count);
void		handle_sigquit(int sig);
void		first_parsing(char *input, t_env_var **envvar, char *afree);
void		unset_var(t_env_var *env, char *key);
t_env_var	*find_var(t_env_var *env, char *key);
t_env_var	*init_envvar(void);
t_env_var	*last_node(t_env_var *init_envvar);

#endif
