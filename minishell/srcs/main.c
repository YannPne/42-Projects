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
#include "../header/minishell.h"

int	g_signal_global;

void	first_parsing(char *input, t_env_var **envvar, char *afree)
{
	if (ft_strnstr(input, "echo ", ft_strlen(input)))
		instru(input, envvar, NULL);
	else if (ft_strnstr(input, "cd ", ft_strlen(input)))
		instru(input, envvar, NULL);
	else if (ft_strnstr(input, "pwd", ft_strlen(input)))
		instru(input, envvar, NULL);
	else if (ft_strnstr(input, "export ", ft_strlen(input)))
		instru(input, envvar, NULL);
	else if (ft_strnstr(input, "unset ", ft_strlen(input)))
		instru(input, envvar, NULL);
	else if (ft_strnstr(input, "env", ft_strlen(input)))
		instru(input, envvar, NULL);
	else if (ft_strnstr(input, "exit", ft_strlen(input)))
		instru(input, envvar, afree);
	else if (ft_strnstr(input, "=", ft_strlen(input)))
		instru(input, envvar, NULL);
	else
		find_cmd(input);
}

void	put_env_list(t_env_var *env, char **environ)
{
	t_env_var	*new;
	int			i;
	int			len;

	i = 0;
	while (environ[i])
	{
		new = malloc(sizeof(t_env_var));
		new->key = ft_substr(environ[i], 0,
				strchr(environ[i], '=') - environ[i]);
		len = strchr(environ[i], '=') - environ[i] + 1;
		new->value = ft_substr(environ[i], len, strlen(environ[i]) - len);
		new->global = true;
		new->next = NULL;
		last_node(env)->next = new;
		i++;
	}
}

void	segments(char *input, t_env_var **env, int i, int seg)
{
	int		e;
	bool	ok;
	char	segments[50][500];

	i = -1;
	e = 0;
	ok = 1;
	while (input[++i])
	{
		if (input[i] == '\"')
			ok = !ok;
		e = 0;
		while (input[i] && (input[i] != '|' || ok))
			segments[seg][e++] = input[i++];
		segments[seg++][e] = '\0';
		if (!input[i] || (input[i] == '|' && input[i + 1] == '|'))
			break ;
	}
	if (--seg == 0)
		first_parsing(segments[seg], env, input);
}

int	minishell(char *instru, t_env_var **env)
{
	char	*afree;

	afree = instru;
	while (instru && *instru && *instru == ' ')
		instru++;
	segments(instru, env, 0, 0);
	add_history(instru);
	free(afree);
	if (!(*env))
		return (1);
	return (0);
}

int	main(int argc, char **argv, char **environnement)
{
	t_env_var	**env;
	char		*data;
	char		*prompt;

	argc = argc;
	argv = argv;
	prompt = "minishell$ ▸ ";
	env = malloc(sizeof(t_env_var *));
	*env = init_envvar();
	put_env_list(*env, environnement);
	while (1)
	{
		g_signal_global = 0;
		signal(SIGINT, handle_sigint);
		signal(SIGQUIT, handle_sigint);
		data = readline(prompt);
		if (data && g_signal_global)
			data = calloc(1000, 1);
		if (!data)
			data = ft_strdup("exit");
		if (data && *data && ft_strlen(data) > 0)
			if (minishell(data, env))
				break ;
	}
}
