/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   sigint.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/23 18:34:43 by ypanares          #+#    #+#             */
/*   Updated: 2024/07/23 18:34:48 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */
#include "../header/minishell.h"

void	handle_sigint(int sig)
{
	g_signal_global = sig;
	if (sig == 2)
		printf("\nminishell$ ▸ ");
}
