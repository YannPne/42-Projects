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

void	create_pipes(int pipe_count, t_poubelle *p)
{
	int	i;

	i = 0;
	while (i < pipe_count - 1)
	{
		if (pipe(p->pipes[i]) == -1)
		{
			perror("pipe");
			exit(EXIT_FAILURE);
		}
		i++;
	}
}

void	close_pipes(int pipe_count, t_poubelle *p)
{
	int	i;

	i = -1;
	while (++i < pipe_count - 1)
	{
		close(p->pipes[i][0]);
		close(p->pipes[i][1]);
	}
}

void	exec_command(int i, int pipe_count, char *command, t_poubelle *p)
{
	p->arg_count = 0;
	p->token = strtok(command, " ");
	while (p->token != NULL && p->arg_count < 20)
	{
		p->args[p->arg_count++] = p->token;
		p->token = strtok(NULL, " ");
	}
	p->args[p->arg_count] = NULL;
	if (i > 0)
		dup2(p->pipes[i - 1][0], STDIN_FILENO);
	if (i < pipe_count - 1)
		dup2(p->pipes[i][1], STDOUT_FILENO);
	close_pipes(pipe_count, p);
	execvp(p->args[0], p->args);
	perror("execvp");
	exit(EXIT_FAILURE);
}

void	fork_and_exec(int pipe_count, char **commands, t_poubelle *p)
{
	p->i = 0;
	while (p->i < pipe_count)
	{
		p->pids[p->i] = fork();
		if ((p->pids[p->i]) == 0)
			exec_command(p->i, pipe_count, commands[p->i], p);
		p->i++;
	}
}

void	execute_pipeline(char **commands, int pipe_count)
{
	t_poubelle	p;

	create_pipes(pipe_count, &p);
	fork_and_exec(pipe_count, commands, &p);
	close_pipes(pipe_count, &p);
	p.i = -1;
	while (++p.i < pipe_count)
		waitpid(p.pids[p.i], NULL, 0);
}
