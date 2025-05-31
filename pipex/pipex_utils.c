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

void	ft_perror(const char *s)
{
	perror(s);
	exit(EXIT_FAILURE);
}

void	exec_cmd(char *cmd, char **envp)
{
	char	*argv[3];

	argv[0] = "/bin/sh";
	argv[1] = "-c";
	argv[2] = cmd;
	argv[3] = NULL;
	if (execve("/bin/sh", argv, envp) == -1)
		ft_perror("Error : execve");
}
