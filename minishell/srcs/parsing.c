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

void	ft_exit(t_env_var **env, char *afree)
{
	t_env_var	*temp;

	while (*env)
	{
		temp = *env;
		*env = (*env)->next;
		free(temp->key);
		free(temp->value);
		free(temp);
		temp = NULL;
	}
	free(afree);
	free(env);
	exit(0);
}

void	execute_command(char *command)
{
	int		i;
	char	*args[100];
	char	*token;

	i = 0;
	token = strtok(command, " ");
	while (token != NULL)
	{
		args[i++] = token;
		token = strtok(NULL, " ");
	}
	args[i] = NULL;
	if (execvp(args[0], args) == -1)
	{
		perror("execvp");
		exit(EXIT_FAILURE);
	}
}

void	instru(char *input, t_env_var **envvar, char *afree)
{
	char	*s_parsing;

	s_parsing = second_parsing(input - 1);
	if (ft_strnstr(input, "export ", ft_strlen(input)))
		export(*envvar, input);
	else if (ft_strnstr(input, "=", ft_strlen(input)))
		environnement_var(input, *envvar, false);
	else if (ft_strnstr(input, "echo ", ft_strlen(input)))
		echo(*envvar, input, s_parsing);
	else if (ft_strnstr(input, "cd ", ft_strlen(input)))
		cd(input);
	else if (ft_strnstr(input, "pwd", ft_strlen(input)))
		pwd();
	else if (ft_strnstr(input, "unset ", ft_strlen(input)))
		unset(input, *envvar);
	else if (ft_strnstr(input, "env", ft_strlen(input)))
		env(*envvar);
	else if (ft_strnstr(input, "exit", ft_strlen(input)))
		ft_exit(envvar, afree);
}

char	*second_parsing(char *input)
{
	bool	ok;
	char	*meta;

	meta = "\0";
	ok = 1;
	while (*(++input) && (!metacaractere_minishell(*input) || !ok))
		if (*input == '\"')
			ok = !ok;
	if (*input == '<')
	{
		meta = "<";
		if (*(input + 1) == '<')
			meta = "<<";
		input++;
	}
	else if (*input == '>')
	{
		meta = ">";
		if (*(input + 1) == '>')
			meta = ">>";
		input++;
	}
	else if (*input == '|')
		meta = "|";
	return (meta);
}

char	*find_cmd(char *cmd)
{
	pid_t	pid;
	int		status;
	char	*argv[4];

	pid = fork();
	if (pid < 0)
		return (NULL);
	else if (pid == 0)
	{
		argv[0] = "/bin/sh";
		argv[1] = "-c";
		argv[2] = cmd;
		argv[3] = NULL;
		if (execve(argv[0], argv, NULL) == -1)
			return (NULL);
	}
	else if (waitpid(pid, &status, 0) == -1)
		return (NULL);
	return (NULL);
}
