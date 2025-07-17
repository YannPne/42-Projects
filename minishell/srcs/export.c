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

void	export(t_env_var *env, char *input)
{
	int	i;

	i = -1;
	while (input[++i])
	{
		if (input[i] == '=')
		{
			i = 0;
			input += 6;
			while (input[i] == ' ')
				i++;
			environnement_var(input + i, env, true);
			return ;
		}
	}
	i = 0;
	input += 6;
	while (env->next)
	{
		env = env->next;
		while (input[i] == ' ')
			i++;
		if (strncmp(env->key, (input + i), strlen(env->key)) == 0)
			env->global = true;
	}
}

void	unset_var(t_env_var *env, char *key)
{
	t_env_var	*prev;

	prev = NULL;
	while (env && ft_strncmp(env->key, key, ft_strlen(key)) != 0)
	{
		prev = env;
		env = env->next;
	}
	if (env == NULL)
		return ;
	if (prev == NULL)
		env = env->next;
	else
		prev->next = env->next;
	free(key);
	free(env->key);
	free(env->value);
	free(env);
}
