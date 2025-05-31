/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pipex.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/03/04 18:21:35 by ypanares          #+#    #+#             */
/*   Updated: 2024/03/04 18:21:46 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "headers/pipex.h"

void	check_pid(t_data data, char **argv, char **envp)
{
	if (data.pid == 0)
	{
		close(data.pipefd[0]);
		dup2(data.file_in, STDIN_FILENO);
		dup2(data.pipefd[1], STDOUT_FILENO);
		exec_cmd(argv[2], envp);
	}
	else
	{
		wait(NULL);
		close(data.pipefd[1]);
		dup2(data.file_out, STDOUT_FILENO);
		dup2(data.pipefd[0], STDIN_FILENO);
		exec_cmd(argv[3], envp);
	}
}

int	main(int argc, char **argv, char **envp)
{
	t_data	data;

	if (argc != 5)
		ft_perror("Error : usage : ./pipex file1 cmd1 cmd2 file2");
	data.file_in = open(argv[1], O_RDONLY);
	data.file_out = open(argv[4], O_WRONLY | O_CREAT | O_TRUNC, 0644);
	if (data.file_in == -1 || data.file_out == -1)
		ft_perror("error : open file");
	if (pipe(data.pipefd) == -1)
		ft_perror("error : pipe");
	data.pid = fork();
	if (data.pid == -1)
		ft_perror("error : pipe");
	check_pid(data, argv, envp);
}
