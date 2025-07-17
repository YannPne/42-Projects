/* ************************************************************************** */
/*																			*/
/*														:::	  ::::::::   */
/*   instructions.c									 :+:	  :+:	:+:   */
/*													+:+ +:+		 +:+	 */
/*   By: mmacia <marvin@42.fr>					  +#+  +:+	   +#+		*/
/*												+#+#+#+#+#+   +#+		   */
/*   Created: 2024/07/23 16:08:02 by mmacia			#+#	#+#			 */
/*   Updated: 2024/07/23 16:08:04 by mmacia		   ###   ########.fr	   */
/*																			*/
/* ************************************************************************** */
#include "../header/minishell.h"

int	meta_echo(t_env_var *env, char *input, char *s_parsing)
{
	if (*s_parsing == '>')
		redirect_input(input, s_parsing, env, 0);
	return (1);
}

void	param_echo2(int *s_quote, int *d_quote, char *input, int *i)
{
	while (input[*i] == '\'' || input[*i] == '\"')
	{
		if (input[*i] == '\'')
		{
			if (*d_quote)
				return ;
			*s_quote = !*s_quote;
		}
		else if (input[*i] == '\"')
		{
			if (*s_quote)
				return ;
			*d_quote = !*d_quote;
		}
		(*i)++;
	}
	return ;
}

int	param_echo(int *s_quote, int *d_quote, char *input, int i)
{
	*s_quote = 0;
	*d_quote = 0;
	while (input[i] && input[i] == ' ')
		i++;
	param_echo2(s_quote, d_quote, input, &i);
	while (*s_quote && input[i] == '\'')
		i++;
	while (*d_quote && input[i] == '\"')
		i++;
	if (*s_quote && *d_quote == 2)
		*s_quote = 0;
	else if (*d_quote && *s_quote == 2)
		*d_quote = 0;
	return (i);
}

char	*retour_ligne(char *src, int retour_ligne)
{
	char	*dest;
	int		i;

	i = -1;
	if (retour_ligne == 0)
	{
		dest = calloc(strlen(src) + 2, sizeof(char));
		while (src[++i])
			dest[i] = src[i];
		dest[i] = '\n';
		dest[i + 1] = '\0';
		return (dest);
	}
	return (src);
}

char	*echo_str_in_var2(t_env_var *env, char *input, int ret, char *key_name)
{
	int	i;
	int	j;

	j = 0;
	i = 4;
	while (input[++i] && !ft_isalpha(input[i]))
	{
		if (input[i] == '$')
		{
			i++;
			while (input[i] && ft_isalpha(input[i]))
				key_name[j++] = input[i++];
			break ;
		}
	}
	key_name[j] = '\0';
	while (env)
	{
		if (env->key && *env->key != '\000'
			&& ft_strncmp(env->key, key_name, strlen(env->key)) == 0)
			return (retour_ligne(env->value, ret));
		env = env->next;
	}
	return ("");
}
